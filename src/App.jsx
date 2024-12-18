import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails';
import Playlist from './components/Playlist';
import { GlobalStyle } from './components/GlobalStyle';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const userId = 'nilank'; // Hardcoded userId

  // Fetch playlists from the API
  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`https://harbour.dev.is/api/playlists?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data && Array.isArray(data.playlists)) {
        setPlaylists(data.playlists);
      } else {
        console.error('Error: No playlists array found in the response', data);
        setPlaylists([]);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    }
  };

  // Function to create a new playlist
  const createPlaylist = async () => {
    try {
      const response = await fetch('https://harbour.dev.is/api/playlists/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlaylistName,
          userId: userId,
        }),
      });

      if (response.ok) {
        fetchPlaylists();
        setCreatingPlaylist(false);
        setNewPlaylistName('');
      } else {
        console.error('Error creating playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  // Fetch videos based on search query
  const searchVideos = async (query) => {
    try {
      const response = await fetch(`https://harbour.dev.is/api/search?q=${query}`);
      const data = await response.json();

      const videos = data.map((video) => ({
        id: video.id.videoId,
        title: video.title,
        channelName: video.channelName,
        url: video.url,
        description: video.description,
        duration: video.duration_raw,
        views: video.views,
        thumbnailUrl: video.snippet.thumbnails.url,
      }));

      setVideoList(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    searchVideos(query);
  };

  const handleAddToPlaylist = async (video) => {
    const thumbnailUrl = video.thumbnailUrl;

    if (!selectedPlaylist) {
      const playlistName = prompt('Enter playlist name or create a new one:', selectedPlaylist ? selectedPlaylist.name : '');
      if (playlistName) {
        const playlist = playlists.find((p) => p.name === playlistName);
        if (playlist) {
          setSelectedPlaylist(playlist);
          setPlaylists(playlists.map((p) =>
            p.name === playlistName ? { ...p, videos: [...p.videos, { ...video, thumbnailUrl }] } : p
          ));
        } else {
          const newPlaylist = { name: playlistName, videos: [{ ...video, thumbnailUrl }] };
          setPlaylists([...playlists, newPlaylist]);
          setSelectedPlaylist(newPlaylist);
        }

        const response = await fetch('https://harbour.dev.is/api/playlists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlistName,
            videos: [
              {
                videoId: video.id,
                title: video.title,
                thumbnailUrl: video.thumbnailUrl,
              },
            ],
            userId: userId,
          }),
        });

        if (!response.ok) {
          console.error('Failed to add video to the playlist');
        }
      }
    } else {
      setPlaylists(playlists.map((p) =>
        p.name === selectedPlaylist.name ? { ...p, videos: [...p.videos, { ...video, thumbnailUrl }] } : p
      ));
    }
  };
  
  const handleDeleteVideo = async (playlistId, videoToDelete) => {
    try {
      const response = await fetch(`https://harbour.dev.is/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: videoToDelete.title,
          videos: [
            {
              videoId: videoToDelete.videoId,
              title: videoToDelete.title,
              thumbnailUrl: videoToDelete.thumbnailUrl,
            },
          ],
        }),
      });

      if (response.ok) {
        setPlaylists(
          playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  videos: playlist.videos.filter((video) => video.videoId !== videoToDelete.videoId),
                }
              : playlist
          )
        );
      } else {
        console.error('Failed to delete the video from the playlist');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div>
      <GlobalStyle />
      <h1>Harbour Tube</h1>
      <SearchBar query={searchQuery} onSearch={handleSearch} />

      {selectedVideo && (
        <div>
          <VideoPlayer video={selectedVideo} />
          <VideoDetails video={selectedVideo} />
        </div>
      )}

      {creatingPlaylist && (
        <div>
          <input
            type="text"
            placeholder="Enter Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button onClick={createPlaylist}>Create Playlist</button>
        </div>
      )}

    <Playlist
      playlists={playlists}
      onSelectVideo={setSelectedVideo}
      onDeleteVideo={handleDeleteVideo} 
      onAddToPlaylist={handleAddToPlaylist}
    />

      <VideoList videos={videoList} onSelectVideo={setSelectedVideo} onAddToPlaylist={handleAddToPlaylist} />
    </div>
  );
}

export default App;

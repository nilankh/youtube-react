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
      // If no playlist is selected, prompt the user to either choose an existing one or create a new one
      const playlistName = prompt('Enter playlist name or create a new one:', selectedPlaylist ? selectedPlaylist.name : '');
  
      if (playlistName) {
        const playlist = playlists.find((p) => p.name === playlistName);
  
        if (playlist) {
          // If the playlist exists, update it with the new video
          setSelectedPlaylist(playlist);
          setPlaylists(playlists.map((p) =>
            p.name === playlistName ? { ...p, videos: [...p.videos, { ...video, thumbnailUrl }] } : p
          ));
  
          // Make the API call to add the video to the existing playlist
          const response = await fetch(`https://harbour.dev.is/api/playlists/${playlist.id}/videos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              videoId: video.id,
              title: video.title,
              thumbnailUrl: video.thumbnailUrl,
            }),
          });
  
          if (!response.ok) {
            console.error('Failed to add video to the playlist');
          }
        } else {
          // If the playlist doesn't exist, create a new one
          const newPlaylist = { name: playlistName, videos: [{ ...video, thumbnailUrl }] };
          setPlaylists([...playlists, newPlaylist]);
          setSelectedPlaylist(newPlaylist);
  
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
            console.error('Failed to create new playlist');
          }
        }
      }
    } else {
      // If a playlist is already selected, update it with the new video
      setPlaylists(playlists.map((p) =>
        p.name === selectedPlaylist.name ? { ...p, videos: [...p.videos, { ...video, thumbnailUrl }] } : p
      ));
  
      // Call the API to add the video to the selected playlist
      const response = await fetch(`https://harbour.dev.is/api/playlists/${selectedPlaylist.id}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
        }),
      });
  
      if (!response.ok) {
        console.error('Failed to add video to the selected playlist');
      }
    }
  };
  
  
  const handleDeleteVideo = async (playlistId, videoToDelete) => {
    try {
      // Construct the API endpoint for deleting the video
      const videoDeleteUrl = `https://harbour.dev.is/api/playlists/${playlistId}/videos/${videoToDelete.videoId}`;
  
      // Make the DELETE request to remove the video
      const response = await fetch(videoDeleteUrl, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Update the local state to remove the deleted video
        setPlaylists((prevPlaylists) => {
          const updatedPlaylists = prevPlaylists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  videos: playlist.videos.filter(
                    (video) => video.videoId !== videoToDelete.videoId
                  ),
                }
              : playlist
          );
  
          // Find the updated playlist
          const updatedPlaylist = updatedPlaylists.find((p) => p.id === playlistId);
  
          // If the playlist is now empty, delete the playlist
          if (updatedPlaylist && updatedPlaylist.videos.length === 0) {
            deletePlaylist(playlistId);
            return updatedPlaylists.filter((playlist) => playlist.id !== playlistId);
          }
  
          return updatedPlaylists;
        });
      } else {
        console.error('Failed to delete the video from the playlist');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };
  
  // Function to delete an empty playlist
  const deletePlaylist = async (playlistId) => {
    try {
      const playlistDeleteUrl = `https://harbour.dev.is/api/playlists/${playlistId}`;
  
      const response = await fetch(playlistDeleteUrl, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        console.error('Failed to delete the empty playlist');
      }
    } catch (error) {
      console.error('Error deleting the playlist:', error);
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
      onSelectVideo={(video) => {
        console.log("Selected video from playlist:", video); 
        setSelectedVideo({
          ...video,
          id: video.videoId, // Map videoId to id
        });
      }}
      onDeleteVideo={handleDeleteVideo}
      onAddToPlaylist={handleAddToPlaylist}
    />

      <VideoList videos={videoList} onSelectVideo={setSelectedVideo} onAddToPlaylist={handleAddToPlaylist} />
    </div>
  );
}

export default App;

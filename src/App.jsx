import React, { useState } from 'react';
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
  const [playlist, setPlaylist] = useState([]);

  // Function to fetch videos
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
      }));

      setVideoList(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    searchVideos(query);
  };

  // Add video to playlist
  const addToPlaylist = (video) => {
    if (!playlist.some((v) => v.id === video.id)) {
      setPlaylist([...playlist, video]);
    }
  };

  // Delete video from playlist
  const deleteFromPlaylist = (videoId) => {
    setPlaylist(playlist.filter((video) => video.id !== videoId));
  };

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

      <Playlist
        videos={playlist}
        onSelectVideo={setSelectedVideo}
        onDeleteVideo={deleteFromPlaylist}
      />

      <VideoList videos={videoList} onSelectVideo={setSelectedVideo} onAddToPlaylist={addToPlaylist} />
    </div>
  );
}

export default App;

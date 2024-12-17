import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails'; 
import { GlobalStyle } from './components/GlobalStyle';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoList, setVideoList] = useState([]);

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

      setVideoList(videos); // Update video list without resetting selected video
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    searchVideos(query); // Perform the search
  };

  return (
    <div>
      <GlobalStyle />
      <SearchBar query={searchQuery} onSearch={handleSearch} />

      {/* Render the currently playing video */}
      {selectedVideo && (
        <div>
          <VideoPlayer video={selectedVideo} />
          <VideoDetails video={selectedVideo} />
        </div>
      )}

      {/* Render video list regardless of whether a video is playing */}
      <VideoList videos={videoList} onSelectVideo={setSelectedVideo} />
    </div>
  );
}

export default App;

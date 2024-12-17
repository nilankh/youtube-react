
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

  const searchVideos = async (query) => {
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
    setVideoList(videos); // Set the state to the processed video data
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    searchVideos(query);
  };

  return (
    <div>
      <GlobalStyle />
      <SearchBar query={searchQuery} onSearch={handleSearch} />
      {selectedVideo ? (
        <div>
          <VideoPlayer video={selectedVideo} />
          <VideoDetails video={selectedVideo} /> 
        </div>
      ) : (
        <VideoList videos={videoList} onSelectVideo={setSelectedVideo} />
      )}
    </div>
  );
}

export default App;

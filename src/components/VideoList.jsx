import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const VideoItem = styled(motion.div)`
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #ddd;
  }
`;

const VideoDetails = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  font-size: 14px;
  color: #666;
`;

const Button = styled.button`
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const VideoList = ({ videos, onSelectVideo, onAddToPlaylist }) => {
  return (
    <div>
      {videos.map((video) => (
        <VideoItem
          key={video.id}
          onClick={() => onSelectVideo(video)}
          whileHover={{ scale: 1.05 }}
        >
          <h3>{video.title}</h3>
          <VideoDetails>
            <span>Channel: {video.channelName}</span>
            <span>Views: {video.views}</span>
            <span>Duration: {video.duration}</span>
          </VideoDetails>
          {/* Add to Playlist Button */}
          <Button onClick={(e) => { 
            e.stopPropagation(); // Prevent selecting the video
            onAddToPlaylist(video); 
          }}>
            Add to Playlist
          </Button>
        </VideoItem>
      ))}
    </div>
  );
};

export default VideoList;

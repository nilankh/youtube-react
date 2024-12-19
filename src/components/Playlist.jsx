import React from 'react';
import styled from 'styled-components';

const PlaylistContainer = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 5px;
`;

const PlaylistItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #eee;
  }
`;

const VideoTitle = styled.div`
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #cc0000;
  }
`;

const Playlist = ({ videos, onSelectVideo, onDeleteVideo }) => {
  if (videos.length === 0) {
    return <PlaylistContainer>No videos in the playlist</PlaylistContainer>;
  }

  return (
    <PlaylistContainer>
      <h3>Playlist</h3>
      {videos.map((video) => (
        <PlaylistItem key={video.id}>
          <VideoTitle onClick={() => onSelectVideo(video)}>
            {video.title}
          </VideoTitle>
          <DeleteButton onClick={() => onDeleteVideo(video.id)}>Delete</DeleteButton>
        </PlaylistItem>
      ))}
    </PlaylistContainer>
  );
};

export default Playlist;

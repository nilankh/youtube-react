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

const Playlist = ({ playlists, onSelectVideo, onDeleteVideo, onAddToPlaylist }) => {
  const handleDeleteVideo = (playlistId, video) => {
    onDeleteVideo(playlistId, video);  // Using onDeleteVideo here
  };

  return (
    <PlaylistContainer>
      <h3>Playlists</h3>
      {playlists.length === 0 ? (
        <div>No playlists available. Create one to start adding videos!</div>
      ) : (
        playlists.map((playlist) => ( 
          <div key={playlist.id}>
            <h4>{playlist.name}</h4>
            {playlist.videos.map((video) => (
              <PlaylistItem key={video.videoId}>
                <img src={video.thumbnailUrl} alt={video.title} style={{ width: '120px' }} />
                <VideoTitle onClick={() => onSelectVideo(video)}>{video.title}</VideoTitle>
                <DeleteButton onClick={() => handleDeleteVideo(playlist.id, video)}>
                  Delete
                </DeleteButton>
              </PlaylistItem>
            ))}
          </div>
        ))
      )}
    </PlaylistContainer>
  );
};

export default Playlist;

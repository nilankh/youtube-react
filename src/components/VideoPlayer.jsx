import React from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div`
  width: 100%;
  height: 400px;
  margin: 20px 0;
`;

const VideoPlayer = ({ video }) => {
  const videoUrl = `https://www.youtube.com/embed/${video.id}`;

  return (
    <div>
      <h2>{video.title}</h2>
      <VideoContainer>
        <iframe
          width="100%"
          height="100%"
          src={videoUrl}
          title={video.title}
          frameBorder="0"
          allowFullScreen
        />
      </VideoContainer>
      <div>
        <p>{video.description}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;

import React from 'react';
import styled from 'styled-components';

const DetailsContainer = styled.div`
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 14px;
  color: #555;
`;

const VideoDetails = ({ video }) => {
  return (
    <DetailsContainer>
      <h3>Video Details</h3>
      <p><strong>Channel:</strong> {video.channelName}</p>
      <p><strong>Views:</strong> {video.views}</p>
      <p><strong>Duration:</strong> {video.duration}</p>
      <p><strong>Description:</strong> {video.description}</p>
    </DetailsContainer>
  );
};

export default VideoDetails;

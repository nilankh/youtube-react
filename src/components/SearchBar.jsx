// src/components/SearchBar.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Input = styled(motion.input)`
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 16px;
`;

const SearchBar = ({ query, onSearch }) => {
  const handleChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div>
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for videos"
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
      />
    </div>
  );
};

export default SearchBar;

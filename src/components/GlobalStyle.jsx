import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #87CEEB;
  }

  h2 {
    font-size: 24px;
    color: #333;
  }

  div {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
`;

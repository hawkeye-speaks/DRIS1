import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  :root {
    --color-bg: #0a0e27;
    --color-bg-secondary: #141930;
    --color-border: #1e2847;
    --color-text: #e8eaed;
    --color-text-secondary: #9aa0a6;
    --color-accent: #8ab4f8;
    --color-accent-secondary: #f28b82;
    --color-success: #81c995;
    --color-warning: #fdd663;
    --color-foundation-genotype: #4d9078;
    --color-foundation-algotype: #7856a4;
    --color-foundation-phenotype: #d17842;
    --radius: 8px;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
  }
  
  code {
    font-family: 'Fira Code', 'Courier New', monospace;
  }
  
  button {
    font-family: inherit;
  }
  
  #root {
    min-height: 100vh;
  }
`

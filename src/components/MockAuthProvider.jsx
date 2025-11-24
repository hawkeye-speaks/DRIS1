import { useState } from 'react';
import styled from 'styled-components';

// Mock auth for local testing
const MockAuthProvider = ({ children }) => {
  const [mockUser, setMockUser] = useState({
    id: 'test-user-123',
    publicMetadata: { credits: 100 }
  });

  return (
    <div>
      <TestBanner>
        🧪 TEST MODE - Credits: {mockUser.publicMetadata.credits}
        <button onClick={() => setMockUser(u => ({ ...u, publicMetadata: { credits: u.publicMetadata.credits + 10 }}))}>
          +10 Credits
        </button>
      </TestBanner>
      {children}
    </div>
  );
};

const TestBanner = styled.div`
  background: #f59e0b;
  color: #000;
  padding: 0.5rem 1rem;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  button {
    background: #000;
    color: #f59e0b;
    border: none;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
`;

export default MockAuthProvider;

import { useState } from 'react';
import styled from 'styled-components';
import { useUser } from '@clerk/clerk-react';
import PricingModal from './PricingModal';

export default function CreditDisplay() {
  const { user } = useUser();
  const credits = user?.publicMetadata?.credits || 0;
  const [showPricing, setShowPricing] = useState(false);

  const isLow = credits < 5;

  return (
    <>
      <Container>
        <CreditBadge $low={isLow}>
          <Icon>⚡</Icon>
          <Count>{credits}</Count>
          <Label>Credits</Label>
        </CreditBadge>
        
        <BuyButton onClick={() => setShowPricing(true)} $low={isLow}>
          {isLow ? 'Buy More' : '+'}
        </BuyButton>
      </Container>

      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        currentCredits={credits}
      />
    </>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CreditBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$low ? 'rgba(239, 68, 68, 0.1)' : 'rgba(138, 180, 248, 0.1)'};
  border: 2px solid ${props => props.$low ? '#ef4444' : 'var(--color-accent)'};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.3s;

  ${props => props.$low && `
    animation: pulse 2s infinite;
  `}

  @keyframes pulse {
    0%, 100% {
      border-color: #ef4444;
    }
    50% {
      border-color: #f87171;
    }
  }
`;

const Icon = styled.span`
  font-size: 1.25rem;
`;

const Count = styled.span`
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: bold;
`;

const Label = styled.span`
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.9rem;
`;

const BuyButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$low ? '#ef4444' : 'var(--color-accent)'};
  color: var(--color-bg);
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

import { useState } from 'react';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: 1500, // cents
    priceDisplay: '$15',
    popular: false,
    savings: null
  },
  {
    id: 'pro',
    name: 'Professional',
    credits: 50,
    price: 6000,
    priceDisplay: '$60',
    popular: true,
    savings: '20% off'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 200,
    price: 20000,
    priceDisplay: '$200',
    popular: false,
    savings: '33% off'
  }
];

export default function PricingModal({ isOpen, onClose, currentCredits }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePurchase = async (tier) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: tier.id,
          credits: tier.credits,
          amount: tier.price
        })
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to initiate checkout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <Header>
          <Title>Get More Credits</Title>
          <Subtitle>You have <strong>{currentCredits}</strong> credits remaining</Subtitle>
        </Header>

        <PricingGrid>
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} $popular={tier.popular}>
              {tier.popular && <PopularBadge>Most Popular</PopularBadge>}
              
              <TierName>{tier.name}</TierName>
              <Price>{tier.priceDisplay}</Price>
              <Credits>{tier.credits} Credits</Credits>
              <PerQuery>${(tier.price / tier.credits / 100).toFixed(2)} per query</PerQuery>
              
              {tier.savings && <Savings>{tier.savings}</Savings>}
              
              <BuyButton
                onClick={() => handlePurchase(tier)}
                disabled={loading}
                $popular={tier.popular}
              >
                {loading ? 'Processing...' : 'Purchase'}
              </BuyButton>
            </PricingCard>
          ))}
        </PricingGrid>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Footer>
          <InfoText>🔒 Secure payment via Stripe</InfoText>
          <InfoText>💳 All major cards accepted</InfoText>
          <InfoText>⚡ Credits added instantly</InfoText>
        </Footer>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: var(--color-bg);
  border: 2px solid var(--color-accent);
  border-radius: 12px;
  padding: 2rem;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: var(--color-accent);
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--color-text);
  opacity: 0.8;
  
  strong {
    color: var(--color-accent);
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PricingCard = styled.div`
  background: ${props => props.$popular ? 'linear-gradient(135deg, rgba(138, 180, 248, 0.1), rgba(138, 180, 248, 0.05))' : 'rgba(255, 255, 255, 0.03)'};
  border: 2px solid ${props => props.$popular ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--color-accent);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const TierName = styled.h3`
  color: var(--color-text);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  margin-top: ${props => props.$popular ? '0.5rem' : '0'};
`;

const Price = styled.div`
  color: var(--color-accent);
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Credits = styled.div`
  color: var(--color-text);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const PerQuery = styled.div`
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const Savings = styled.div`
  color: #4ade80;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const BuyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.$popular ? 'var(--color-accent)' : 'rgba(138, 180, 248, 0.2)'};
  color: ${props => props.$popular ? 'var(--color-bg)' : 'var(--color-accent)'};
  border: 2px solid var(--color-accent);
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-accent);
    color: var(--color-bg);
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InfoText = styled.div`
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.85rem;
`;

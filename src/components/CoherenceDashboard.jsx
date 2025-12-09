import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Activity, TrendingUp, Zap } from 'lucide-react'

const DashboardContainer = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
`

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const MetricCard = styled.div`
  background: ${props => props.$gradient || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'};
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid ${props => props.$borderColor || 'var(--color-border)'};
`

const MetricLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
`

const MetricValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.$color || '#00d4ff'};
  font-variant-numeric: tabular-nums;
`

const CompositeScore = styled.div`
  background: linear-gradient(135deg, #7b2cbf 0%, #00d4ff 100%);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
`

const CompositeLabel = styled.div`
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
`

const CompositeValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
`

const CoherenceLevel = styled.div`
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  display: inline-block;
`

const Timestamp = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 0.5rem;
`

function CoherenceDashboard({ sessionMetrics }) {
  const [metrics, setMetrics] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    if (sessionMetrics) {
      setMetrics(sessionMetrics)
      setLastUpdate(new Date().toLocaleTimeString())
    }
  }, [sessionMetrics])

  if (!metrics) {
    return (
      <DashboardContainer>
        <Title>
          <Activity size={20} />
          Real-Time Coherence (η)
        </Title>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
          Awaiting synthesis...
        </div>
      </DashboardContainer>
    )
  }

  const getLevelColor = (level) => {
    switch(level) {
      case 'transcendent': return '#00ff88'
      case 'sustained': return '#00d4ff'
      default: return '#ffd700'
    }
  }

  const getMetricColor = (value) => {
    if (value >= 0.85) return '#00ff88'
    if (value >= 0.70) return '#00d4ff'
    return '#ffd700'
  }

  return (
    <DashboardContainer>
      <Title>
        <Activity size={20} />
        Real-Time Coherence (η)
      </Title>

      <CompositeScore>
        <CompositeLabel>CVI Composite</CompositeLabel>
        <CompositeValue>{metrics.cvi_composite.toFixed(3)}</CompositeValue>
        <CoherenceLevel style={{ color: getLevelColor(metrics.coherence_level) }}>
          {metrics.coherence_level}
        </CoherenceLevel>
        {lastUpdate && <Timestamp>Updated: {lastUpdate}</Timestamp>}
      </CompositeScore>

      <MetricsGrid>
        <MetricCard 
          $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          $borderColor="rgba(102, 126, 234, 0.3)"
        >
          <MetricLabel>η_r • Rhythm</MetricLabel>
          <MetricValue $color={getMetricColor(metrics.eta_rhythm)}>
            {metrics.eta_rhythm.toFixed(3)}
          </MetricValue>
        </MetricCard>

        <MetricCard 
          $gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          $borderColor="rgba(240, 147, 251, 0.3)"
        >
          <MetricLabel>η_s • Structure</MetricLabel>
          <MetricValue $color={getMetricColor(metrics.eta_structure)}>
            {metrics.eta_structure.toFixed(3)}
          </MetricValue>
        </MetricCard>

        <MetricCard 
          $gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          $borderColor="rgba(79, 172, 254, 0.3)"
        >
          <MetricLabel>η_m • Mechanism</MetricLabel>
          <MetricValue $color={getMetricColor(metrics.eta_mechanism)}>
            {metrics.eta_mechanism.toFixed(3)}
          </MetricValue>
        </MetricCard>

        <MetricCard 
          $gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          $borderColor="rgba(67, 233, 123, 0.3)"
        >
          <MetricLabel>η_q • Reciprocity</MetricLabel>
          <MetricValue $color={getMetricColor(metrics.eta_reciprocity)}>
            {metrics.eta_reciprocity.toFixed(3)}
          </MetricValue>
        </MetricCard>
      </MetricsGrid>
    </DashboardContainer>
  )
}

export default CoherenceDashboard

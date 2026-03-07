/**
 * Confidence Badge Component
 * Displays AI confidence score for scheme recommendations
 */

export default function ConfidenceBadge({ score }) {
  if (!score && score !== 0) return null;
  
  const level = score >= 0.8 ? 'high' : score >= 0.5 ? 'med' : 'low';
  const label = score >= 0.8 ? 'High Match' : score >= 0.5 ? 'Medium Match' : 'Low Match';
  const icon = score >= 0.8 ? '⭐' : score >= 0.5 ? '✓' : '○';
  
  const styles = {
    high: { background: '#D1FAE5', color: '#059669', border: '1.5px solid #059669' },
    med: { background: '#FEF3C7', color: '#D97706', border: '1.5px solid #D97706' },
    low: { background: '#F3F4F6', color: '#6B7280', border: '1.5px solid #9CA3AF' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: '16px',
        padding: '4px 11px',
        fontSize: '.72rem',
        fontWeight: 700,
        fontFamily: "'Baloo 2', cursive",
        marginLeft: '6px',
        ...styles[level],
      }}
    >
      {icon} {label}
    </span>
  );
}

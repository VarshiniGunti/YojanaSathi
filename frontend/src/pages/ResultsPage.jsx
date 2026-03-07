/**
 * Results Page - Government Style
 */

import ProfileSummary from '../components/ProfileSummary';
import LanguageSelector from '../components/LanguageSelector';
import ConfidenceBadge from '../components/ConfidenceBadge';

export default function ResultsPage({ schemes, profile, language, onLanguageChange, onViewScheme, onNewSearch }) {
  const eligible = schemes.filter(s => s.status === 'Eligible');
  const potentially = schemes.filter(s => s.status === 'Potentially Eligible');
  const notEligible = schemes.filter(s => s.status === 'Not Eligible');

  const SchemeCard = ({ scheme }) => (
    <div
      className="card card-hover"
      onClick={() => scheme.status !== 'Not Eligible' && onViewScheme(scheme)}
      style={{
        marginBottom: '16px',
        opacity: scheme.status === 'Not Eligible' ? 0.6 : 1,
        cursor: scheme.status === 'Not Eligible' ? 'default' : 'pointer',
      }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: scheme.status === 'Eligible' ? '#D1FAE5' : scheme.status === 'Potentially Eligible' ? '#FEF3C7' : '#FEE2E2',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: scheme.status === 'Eligible' ? '#059669' : scheme.status === 'Potentially Eligible' ? '#D97706' : '#DC2626',
          flexShrink: 0,
        }}>
          {scheme.name.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            {scheme.status === 'Eligible' && (
              <span className="badge badge-success">✓ Eligible</span>
            )}
            {scheme.status === 'Potentially Eligible' && (
              <span className="badge badge-warning">⚠ Check Eligibility</span>
            )}
            {scheme.status === 'Not Eligible' && (
              <span className="badge badge-error">✗ Not Eligible</span>
            )}
            <ConfidenceBadge score={scheme.confidence} />
          </div>

          <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>{scheme.name}</h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>
            {scheme.ministry}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#111827' }}>
            {scheme.reasoning}
          </p>
        </div>

        {scheme.status !== 'Not Eligible' && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '12px' }}>
            <path d="M7.5 15L12.5 10L7.5 5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '40px 20px', minHeight: 'calc(100vh - 64px - 200px)' }}>
      <div className="container-narrow">
        {/* Header */}
        <div style={{
          background: 'white',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: '1.75rem' }}>Your Scheme Recommendations</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {language && onLanguageChange && (
                <LanguageSelector value={language} onChange={onLanguageChange} variant="header" />
              )}
              <button className="btn btn-secondary" onClick={onNewSearch} style={{ fontSize: '0.875rem' }}>
                New Search
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.875rem', color: '#6B7280' }}>
            <span>👤 {profile.profession}</span>
            <span>•</span>
            <span>📍 {profile.state}</span>
            <span>•</span>
            <span>🏷️ {profile.category}</span>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '24px',
          }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#D1FAE5', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>{eligible.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>Eligible</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#FEF3C7', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#D97706' }}>{potentially.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>Check</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#F3F4F6', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6B7280' }}>{notEligible.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600 }}>Not Eligible</div>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <ProfileSummary 
          profile={profile} 
          eligibleCount={eligible.length} 
          potentialCount={potentially.length} 
        />

        {/* Eligible Schemes */}
        {eligible.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#059669' }}>
              ✓ Eligible Schemes ({eligible.length})
            </h2>
            {eligible.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)}
          </div>
        )}

        {/* Potentially Eligible */}
        {potentially.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#D97706' }}>
              ⚠ Check These Schemes ({potentially.length})
            </h2>
            {potentially.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)}
          </div>
        )}

        {/* Not Eligible */}
        {notEligible.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#6B7280' }}>
              Not Eligible ({notEligible.length})
            </h2>
            {notEligible.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '32px' }}>
          ⚠️ Results are AI-generated. Please verify eligibility at official government portals before applying.
        </p>
      </div>
    </div>
  );
}

/**
 * Scheme Details Page - Government Style
 */

import ConfidenceBadge from '../components/ConfidenceBadge';

export default function SchemeDetails({ scheme, onBack }) {
  return (
    <div style={{ padding: '40px 20px', minHeight: 'calc(100vh - 64px - 200px)' }}>
      <div className="container-narrow">
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#1A73E8',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '24px',
            padding: '8px 0',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Results
        </button>

        {/* Header Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'inline-block',
            background: '#EFF6FF',
            color: '#1A73E8',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}>
            GOVERNMENT SCHEME
          </div>

          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{scheme.name}</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{scheme.ministry}</p>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {scheme.status === 'Eligible' && (
              <span className="badge badge-success" style={{ fontSize: '0.875rem', padding: '6px 16px' }}>
                ✓ You Are Eligible
              </span>
            )}
            {scheme.status === 'Potentially Eligible' && (
              <span className="badge badge-warning" style={{ fontSize: '0.875rem', padding: '6px 16px' }}>
                ⚠ Check Eligibility
              </span>
            )}
            <ConfidenceBadge score={scheme.confidence} />
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #E6F7F5, #D1FAE5)', border: '2px solid #0D6B63' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#fff',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="#0D6B63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D6B63', margin: 0 }}>
              AI Eligibility Assessment
            </h2>
          </div>
          <p style={{ color: '#084E47', fontSize: '0.9375rem', lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
            {scheme.reasoning}
          </p>
        </div>

        {/* Description */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
            About This Scheme
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.7 }}>{scheme.description}</p>
        </div>

        {/* Eligibility */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>✓</span>
            Eligibility Assessment
          </h2>
          <div style={{
            background: scheme.status === 'Eligible' ? '#D1FAE5' : '#FEF3C7',
            border: `1px solid ${scheme.status === 'Eligible' ? '#059669' : '#D97706'}`,
            borderRadius: '6px',
            padding: '16px',
            color: '#111827',
          }}>
            {scheme.reasoning}
          </div>
        </div>

        {/* Benefits */}
        {scheme.benefits && scheme.benefits.length > 0 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              Benefits
            </h2>
            <ul style={{ paddingLeft: '20px', color: '#374151' }}>
              {scheme.benefits.map((benefit, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Documents */}
        {scheme.documents && scheme.documents.length > 0 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              Required Documents
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {scheme.documents.map((doc, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#F9FAFB',
                  borderRadius: '6px',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    background: '#1A73E8',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Steps */}
        {scheme.steps && scheme.steps.length > 0 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>📋</span>
              How to Apply
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {scheme.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#1A73E8',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                      {typeof step === 'string' ? step : step.d || step.description || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div style={{ textAlign: 'center' }}>
          <a
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-large"
            style={{ textDecoration: 'none' }}
          >
            Visit Official Portal
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667M12.5 2.5H17.5M17.5 2.5V7.5M17.5 2.5L8.33333 11.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '12px' }}>
            🔒 Secure government website
          </p>
        </div>
      </div>
    </div>
  );
}

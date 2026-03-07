/**
 * Landing Page - Government Digital Service Style
 */

export default function LandingPage({ onGetStarted }) {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1A73E8 0%, #1557B0 100%)',
        color: 'white',
        padding: '80px 20px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '24px',
            letterSpacing: '0.5px',
          }}>
            GOVERNMENT OF INDIA INITIATIVE
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'white',
          }}>
            Find Government Schemes You Are Eligible For
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '32px',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            margin: '0 auto 32px',
          }}>
            Discover government benefits based on your profile using AI. Get personalized recommendations with eligibility explanations and application guidance.
          </p>
          
          <button className="btn btn-large" onClick={onGetStarted} style={{
            background: 'white',
            color: '#1A73E8',
            fontWeight: 700,
          }}>
            Find Schemes
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>
            How YojanaSathi Helps You
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
          }}>
            {[
              {
                icon: '🎯',
                title: 'Personalized Recommendations',
                desc: 'Get schemes matched to your specific profile and needs',
              },
              {
                icon: '✓',
                title: 'Eligibility Explanation',
                desc: 'Understand why you qualify or don\'t qualify for each scheme',
              },
              {
                icon: '📄',
                title: 'Document Checklist',
                desc: 'Know exactly which documents you need to apply',
              },
              {
                icon: '📋',
                title: 'Application Guidance',
                desc: 'Step-by-step instructions to complete your application',
              },
            ].map((feature, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '60px 20px',
        background: '#F5F7FA',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '16px' }}>Ready to Find Your Benefits?</h2>
          <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '32px' }}>
            Answer a few simple questions and discover all government schemes you qualify for.
          </p>
          <button className="btn btn-primary btn-large" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

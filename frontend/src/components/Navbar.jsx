/**
 * Government-style Navbar Component
 */

export default function Navbar({ onHomeClick, currentPage }) {
  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #D1D5DB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={onHomeClick}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #1A73E8, #1557B0)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
              YojanaSathi
            </div>
            <div style={{ fontSize: '0.625rem', color: '#6B7280', fontWeight: 500, letterSpacing: '0.5px' }}>
              AI GOVERNMENT SCHEME FINDER
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button 
            onClick={onHomeClick}
            style={{
              background: 'none',
              border: 'none',
              color: currentPage === 'landing' ? '#1A73E8' : '#6B7280',
              fontWeight: currentPage === 'landing' ? 600 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '8px 0',
              borderBottom: currentPage === 'landing' ? '2px solid #1A73E8' : '2px solid transparent',
            }}
          >
            Home
          </button>
          <button 
            onClick={() => currentPage === 'landing' && onHomeClick()}
            style={{
              background: 'none',
              border: 'none',
              color: currentPage !== 'landing' ? '#1A73E8' : '#6B7280',
              fontWeight: currentPage !== 'landing' ? 600 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '8px 0',
              borderBottom: currentPage !== 'landing' ? '2px solid #1A73E8' : '2px solid transparent',
            }}
          >
            Find Schemes
          </button>
        </div>
      </div>
    </nav>
  );
}

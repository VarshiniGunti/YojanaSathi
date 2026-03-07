/**
 * Government-style Footer Component
 */

export default function Footer() {
  return (
    <footer style={{
      background: '#1F2937',
      color: '#D1D5DB',
      padding: '40px 20px 20px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '32px',
        }}>
          {/* About */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
              About YojanaSathi
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              AI-powered platform to help Indian citizens discover government schemes they are eligible for.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Privacy Policy</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Terms of Service</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Disclaimer</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
              Support
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              For technical support or queries, please contact your nearest Common Service Centre (CSC).
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            © 2025 YojanaSathi. Built for AI for Bharat Hackathon.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            Powered by Amazon Bedrock AI
          </p>
        </div>
      </div>
    </footer>
  );
}

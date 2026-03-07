/**
 * Profile Summary Component
 * Shows why schemes were recommended based on user profile
 */

export default function ProfileSummary({ profile, eligibleCount, potentialCount }) {
  const totalRelevant = eligibleCount + potentialCount;

  return (
    <div
      style={{
        background: '#fff',
        border: '2px solid #E6F7F5',
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
      }}
      className="fu"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: '#E6F7F5',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 7.57 19.18 6 17.38C6.03 15.32 10 14.2 12 14.2C13.97 14.2 17.97 15.32 18 17.38C16.43 19.18 14.03 20 12 20Z"
              fill="#0D6B63"
            />
          </svg>
        </div>
        <div
          className="bal"
          style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1A1A2E' }}
        >
          Why these schemes?
        </div>
      </div>
      <p style={{ fontSize: '.88rem', color: '#4A5568', lineHeight: 1.6 }}>
        Based on your profile as a <strong>{profile.profession}</strong> from{' '}
        <strong>{profile.state}</strong> with income <strong>{profile.income}</strong> and
        category <strong>{profile.category}</strong>, we found{' '}
        <strong>{totalRelevant}</strong> relevant government schemes.
      </p>
    </div>
  );
}

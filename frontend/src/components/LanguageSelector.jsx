/**
 * Language Selector Component
 * Allows users to switch between supported languages
 */

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'हिंदी', label: 'हिंदी' },
  { value: 'తెలుగు', label: 'తెలుగు' },
  { value: 'தமிழ்', label: 'தமிழ்' },
  { value: 'বাংলা', label: 'বাংলা' },
  { value: 'मराठी', label: 'मराठी' },
];

export default function LanguageSelector({ value, onChange, variant = 'default' }) {
  if (variant === 'header') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="language-selector-header"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '14px 16px',
        border: '2px solid #E8EEF0',
        borderRadius: 14,
        fontFamily: "'Hind', sans-serif",
        fontSize: '1rem',
        color: '#1A1A2E',
        background: '#FAFAFA',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%234A5568' d='M5 7L0 0h10z'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center',
        paddingRight: 40,
      }}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Profile Form Page - Government Style
 */

import { useState } from 'react';

const PROFESSIONS = ['Farmer', 'Student', 'Daily Wage Worker', 'Self-Employed', 'Street Vendor', 'Salaried', 'Homemaker', 'Unemployed'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const INCOMES = ['Below ₹10,000 / month', '₹10,000 – ₹25,000 / month', '₹25,000 – ₹50,000 / month', 'Above ₹50,000 / month'];
const LANGUAGES = ['English', 'हिंदी', 'తెలుగు', 'தமிழ்', 'বাংলা', 'मराठी'];
const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'];

export default function ProfileForm({ onSubmit, prefill = {} }) {
  const [form, setForm] = useState({
    age: prefill?.age || '',
    income: prefill?.income || '',
    category: prefill?.category || '',
    profession: prefill?.profession || '',
    state: prefill?.state || '',
    language: 'English',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.age || form.age < 1 || form.age > 100) newErrors.age = 'Please enter a valid age (1-100)';
    if (!form.income) newErrors.income = 'Please select your income range';
    if (!form.category) newErrors.category = 'Please select your category';
    if (!form.profession) newErrors.profession = 'Please select your profession';
    if (!form.state) newErrors.state = 'Please select your state';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Map display language to language code
      const languageMap = {
        'English': 'en',
        'हिंदी': 'hi',
        'తెలుగు': 'te',
        'தமிழ்': 'ta',
        'বাংলা': 'bn',
        'मराठी': 'mr'
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${apiUrl}/schemes/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            age: parseInt(form.age),
            income: form.income,
            category: form.category,
            occupation: form.profession,
            state: form.state,
            gender: 'male',
          },
          query: '',
          language: languageMap[form.language] || 'en',
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const schemes = (data.results || []).map(s => ({
        id: s.id,
        name: s.name,
        status: s.ai_assessment?.status || 'Eligible',
        reasoning: s.ai_assessment?.reasoning || s.description,
        confidence: s.score || s.confidence || s.ai_assessment?.confidence || 0.75,
        ministry: s.ministry,
        description: s.description,
        benefits: Array.isArray(s.benefits) ? s.benefits : [s.benefit],
        documents: s.documents || [],
        steps: s.applicationProcess || [],
        link: s.officialLinks?.portal || '#',
      }));

      setLoading(false);
      onSubmit(form, schemes);
    } catch (error) {
      console.error('API Error:', error);
      setLoading(false);
      setErrors({ api: 'Failed to fetch schemes. Please try again.' });
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 64px - 200px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}>
        <div className="spinner" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Analyzing Your Profile</h2>
        <p style={{ color: '#6B7280' }}>Searching through 100+ government schemes...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', minHeight: 'calc(100vh - 64px - 200px)' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ marginBottom: '12px' }}>Enter Your Profile</h1>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>
            We'll find all government schemes you're eligible for
          </p>
        </div>

        {errors.api && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #DC2626',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#DC2626',
          }}>
            {errors.api}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Age */}
            <div className="form-group">
              <label className="form-label form-label-required">Your Age</label>
              <input
                type="number"
                className={`form-input ${errors.age ? 'error' : ''}`}
                placeholder="Enter your age"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
              {errors.age && <div className="form-error">{errors.age}</div>}
            </div>

            {/* Income */}
            <div className="form-group">
              <label className="form-label form-label-required">Monthly Income</label>
              <select
                className={`form-select ${errors.income ? 'error' : ''}`}
                value={form.income}
                onChange={(e) => handleChange('income', e.target.value)}
              >
                <option value="">Select income range</option>
                {INCOMES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              {errors.income && <div className="form-error">{errors.income}</div>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label form-label-required">Category / Caste</label>
              <select
                className={`form-select ${errors.category ? 'error' : ''}`}
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>

            {/* Profession */}
            <div className="form-group">
              <label className="form-label form-label-required">Profession</label>
              <select
                className={`form-select ${errors.profession ? 'error' : ''}`}
                value={form.profession}
                onChange={(e) => handleChange('profession', e.target.value)}
              >
                <option value="">Select your profession</option>
                {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.profession && <div className="form-error">{errors.profession}</div>}
            </div>

            {/* State */}
            <div className="form-group">
              <label className="form-label form-label-required">State</label>
              <select
                className={`form-select ${errors.state ? 'error' : ''}`}
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
              >
                <option value="">Select your state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <div className="form-error">{errors.state}</div>}
            </div>

            {/* Language */}
            <div className="form-group">
              <label className="form-label">Preferred Language</label>
              <select
                className="form-select"
                value={form.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Find My Schemes
            </button>

            <p style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#9CA3AF',
              marginTop: '16px',
            }}>
              🔒 Your data is private and secure. We do not store personal information.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

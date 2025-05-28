import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import AuthLayout from '../components/AuthLayout';

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('auth_token', response.data.access_token);
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      setError(
        error.response?.data?.message || 'An error occurred during registration'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Already have an account?"
      link="/login"
      linkText="Sign in"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="text-sm text-[var(--ctp-red)] mb-4">
            {error}
          </div>
        )}
          <div>
            <input
              id="name"
              name="name"
              type="text"
              required
            className="w-full px-3 py-2 bg-[var(--ctp-surface0)] border border-[var(--ctp-surface1)] rounded text-[var(--ctp-text)]"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            className="w-full px-3 py-2 bg-[var(--ctp-surface0)] border border-[var(--ctp-surface1)] rounded text-[var(--ctp-text)]"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
            className="w-full px-3 py-2 bg-[var(--ctp-surface0)] border border-[var(--ctp-surface1)] rounded text-[var(--ctp-text)]"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
            className="w-full px-3 py-2 bg-[var(--ctp-surface0)] border border-[var(--ctp-surface1)] rounded text-[var(--ctp-text)]"
              placeholder="Confirm password"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
          className="w-full py-2 bg-[var(--ctp-blue)] text-[var(--ctp-crust)] rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
      </form>
    </AuthLayout>
  );
} 

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import AuthLayout from '../components/AuthLayout';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    try {
      const response = await authAPI.login(formData);
      const token = response.data.access_token;
      if (!token) throw new Error('No access token received from server');
      localStorage.setItem('auth_token', token);
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        setError('No response from server. Please check if the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Don't have an account?"
      link="/register"
      linkText="Create one"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="text-sm text-[var(--ctp-red)] mb-4">
            {error}
          </div>
        )}
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
              autoComplete="current-password"
              required
            className="w-full px-3 py-2 bg-[var(--ctp-surface0)] border border-[var(--ctp-surface1)] rounded text-[var(--ctp-text)]"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
          className="w-full py-2 bg-[var(--ctp-blue)] text-[var(--ctp-crust)] rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
      </form>
    </AuthLayout>
  );
} 
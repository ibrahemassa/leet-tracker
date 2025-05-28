import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    try {
      const updateData = {};

      if (formData.name !== user.name) {
        updateData.name = formData.name;
      }
      if (formData.email !== user.email) {
        updateData.email = formData.email;
      }
      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          setError('Passwords do not match');
          return;
        }
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      if (Object.keys(updateData).length > 0) {
        await authAPI.updateProfile(updateData);
        const response = await authAPI.getUser();
        if (setUser) {
          setUser(response.data);
        }
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          password: '',
          password_confirmation: '',
        }));
      } else {
        setSuccess('No changes to update');
        setIsEditing(false);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 'An error occurred while updating profile'
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[var(--ctp-blue)]">
            Profile Settings
          </h3>
          <p className="mt-2 text-[var(--ctp-subtext0)]">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="card px-6 py-5">
        {error && (
          <div className="mb-6 bg-[var(--ctp-red-bg)] border-l-4 border-[var(--ctp-red)] p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-[var(--ctp-red)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-[var(--ctp-red)]">{error}</p>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-[var(--ctp-green-bg)] border-l-4 border-[var(--ctp-green)] p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-[var(--ctp-green)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-[var(--ctp-green)]">{success}</p>
              </div>
            </div>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--ctp-subtext0)]"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-[var(--ctp-surface2)] bg-[var(--ctp-base)] text-[var(--ctp-text)] shadow-sm focus:border-[var(--ctp-blue)] focus:ring-[var(--ctp-blue)] sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--ctp-subtext0)]"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-[var(--ctp-surface2)] bg-[var(--ctp-base)] text-[var(--ctp-text)] shadow-sm focus:border-[var(--ctp-blue)] focus:ring-[var(--ctp-blue)] sm:text-sm"
              />
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-[var(--ctp-surface2)]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-[var(--ctp-base)] text-sm text-[var(--ctp-subtext0)]">
                    Change Password
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-[var(--ctp-surface2)] bg-[var(--ctp-base)] text-[var(--ctp-text)] shadow-sm focus:border-[var(--ctp-blue)] focus:ring-[var(--ctp-blue)] sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  id="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-[var(--ctp-surface2)] bg-[var(--ctp-base)] text-[var(--ctp-text)] shadow-sm focus:border-[var(--ctp-blue)] focus:ring-[var(--ctp-blue)] sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--ctp-text)] bg-[var(--ctp-surface1)] hover:bg-[var(--ctp-surface2)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ctp-blue)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-[var(--ctp-subtext0)]">Name</h4>
              <p className="mt-1 text-sm text-[var(--ctp-text)]">{user.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[var(--ctp-subtext0)]">Email</h4>
              <p className="mt-1 text-sm text-[var(--ctp-text)]">{user.email}</p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { authAPI } from './services/api';

import Navbar from './components/layout/Navbar';

import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Solutions from './pages/Solutions';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authAPI.getUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {user ? (
          <div className="min-h-screen bg-[var(--ctp-base)] flex flex-col">
            <Navbar user={user} setUser={setUser} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto py-8 px-2 sm:px-6 lg:px-8 pt-24">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/problems" element={<Problems />} />
                  <Route path="/solutions" element={<Solutions />} />
                  <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
          </div>
        ) : (
          <div className="flex min-h-screen bg-[var(--ctp-base)] items-center justify-center">
            <div className="w-full max-w-md card p-8 space-y-8">
              <Routes>
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<Register setUser={setUser} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </div>
        )}
      </Router>
    </QueryClientProvider>
  );
}

export default App;

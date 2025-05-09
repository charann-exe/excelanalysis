import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user in context
      setUser(user);
      
      // Navigate to dashboard based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill admin credentials
  const handleAdminLogin = () => {
    setFormData({ email: 'admin@gmail.com', password: 'admin@123' });
    setLoginType('admin');
  };

  // Quick-fill user credentials
  const handleUserLogin = () => {
    setFormData({ email: '', password: '' });
    setLoginType('user');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <div className="login-type-buttons" style={{ marginBottom: 20 }}>
          <button 
            type="button" 
            onClick={handleUserLogin}
            style={{ 
              background: loginType === 'user' ? '#4CAF50' : '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '8px 20px',
              cursor: 'pointer',
              marginRight: 10
            }}
          >
            User Login
          </button>
          <button 
            type="button" 
            onClick={handleAdminLogin}
            style={{ 
              background: loginType === 'admin' ? '#4CAF50' : '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '8px 20px',
              cursor: 'pointer'
            }}
          >
            Admin Login
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={loading}
              placeholder={loginType === 'admin' ? 'admin@gmail.com' : 'Enter your email'}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
              placeholder={loginType === 'admin' ? 'admin@123' : 'Enter your password'}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: loginType === 'admin' ? '#dc2626' : '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '10px 20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              marginTop: 10
            }}
          >
            {loading ? 'Logging in...' : `${loginType === 'admin' ? 'Admin' : 'User'} Login`}
          </button>
        </form>
        <p style={{ marginTop: 20, textAlign: 'center' }}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login; 
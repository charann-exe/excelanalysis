import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const fetchUserHistory = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUserHistory(response.data);
      setSelectedUser(userId);
    } catch (error) {
      setError('Failed to fetch user history');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setForm({ username: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (selectedUser === userId) setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="users-section">
          <h3>Users</h3>
          <form onSubmit={handleAddUser} style={{ marginBottom: 20 }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleFormChange}
              required
              style={{ marginRight: 8 }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleFormChange}
              required
              style={{ marginRight: 8 }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleFormChange}
              required
              style={{ marginRight: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleFormChange}
              style={{ marginRight: 8 }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={formLoading}>
              {formLoading ? 'Adding...' : 'Add User'}
            </button>
          </form>
          <div className="users-list">
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-item ${selectedUser === user._id ? 'selected' : ''}`}
                onClick={() => fetchUserHistory(user._id)}
              >
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <button
                  style={{ marginTop: 8, background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); handleDeleteUser(user._id); }}
                  disabled={formLoading}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="history-section">
          <h3>User Upload History</h3>
          {selectedUser ? (
            <div className="history-list">
              {userHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <p>File: {item.fileName}</p>
                  <p>Upload Date: {new Date(item.uploadDate).toLocaleDateString()}</p>
                  <p>Analysis: {item.analysisResult}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Select a user to view their upload history</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
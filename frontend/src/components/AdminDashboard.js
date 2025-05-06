import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [error, setError] = useState('');
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
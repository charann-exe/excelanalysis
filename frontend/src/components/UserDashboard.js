import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import './UserDashboard.css';

const UserDashboard = () => {
  const [uploadHistory, setUploadHistory] = useState([
    // Example data, replace with real API data if available
    // { originalName: 'file1.xlsx', uploadDate: new Date(), fileSize: 1024 * 50 }
  ]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Example stats, replace with real data if available
  const uploadedFiles = uploadHistory.length;
  const chartsCreated = 0;
  const totalStorage = uploadHistory.reduce((acc, item) => acc + (item.fileSize || 0), 0);

  useEffect(() => {
    fetchUser();
    fetchUploadHistory();
  }, []);

  const fetchUser = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Assuming the response contains user information
      // Update the state accordingly
    } catch (error) {
      // fallback to Demo User
    }
  };

  const fetchUploadHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/excel/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUploadHistory(response.data);
    } catch (error) {
      // setError('Failed to fetch upload history');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Navbar />
    <div className="dashboard-bg">
      <div className="dashboard-header-row">
        <div>
            <h2>Welcome back, {user?.name || 'Demo User'}!</h2>
            <p className="dashboard-sub">
              Upload Excel files and transform your data into stunning visualizations.
            </p>
        </div>
          <button className="upload-btn" onClick={() => navigate('/upload-excel')}>
          <span role="img" aria-label="upload">📤</span> Upload New File
        </button>
      </div>

      <div className="dashboard-cards-row">
        <div className="dashboard-card">
          <div className="dashboard-card-title">Uploaded Files</div>
            <div className="dashboard-card-value">{uploadedFiles}</div>
          <div className="dashboard-card-desc">Total Excel files uploaded</div>
          <div className="dashboard-card-icon dashboard-card-icon-blue">📄</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-title">Charts Created</div>
            <div className="dashboard-card-value">{chartsCreated}</div>
          <div className="dashboard-card-desc">Visualizations generated</div>
          <div className="dashboard-card-icon dashboard-card-icon-green">📊</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-title">Storage Used</div>
          <div className="dashboard-card-value">{formatFileSize(totalStorage)}</div>
          <div className="dashboard-card-desc">Of your total storage</div>
          <div className="dashboard-card-icon dashboard-card-icon-purple">🗄️</div>
        </div>
      </div>

      <div className="dashboard-main-row">
        <div className="dashboard-main-col dashboard-main-col-activity">
          <div className="dashboard-section-title">Recent Activity</div>
          <div className="dashboard-section-desc">Your latest files and charts</div>
          {uploadHistory.length === 0 ? (
            <div className="dashboard-empty">
                <p>No recent activity yet.<br />Start by uploading an Excel file.</p>
                <button className="upload-btn-secondary" onClick={() => navigate('/upload-excel')}>
                <span role="img" aria-label="upload">📤</span> Upload File
              </button>
            </div>
          ) : (
            <div className="dashboard-activity-list">
              {uploadHistory.slice(0, 3).map((item, idx) => (
                <div key={idx} className="dashboard-activity-item">
                  <div className="dashboard-activity-filename">{item.originalName}</div>
                  <div className="dashboard-activity-meta">
                    <span>{new Date(item.uploadDate).toLocaleString()}</span>
                    <span>{formatFileSize(item.fileSize)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="dashboard-main-col dashboard-main-col-actions">
          <div className="dashboard-section-title">Quick Actions</div>
          <div className="dashboard-section-desc">Common tasks you can perform</div>
            <button className="upload-btn-full" onClick={() => navigate('/upload-excel')}>
              <span role="img" aria-label="upload">📤</span> Upload Excel File
              </button>
            <button className="view-history-btn">
              <span role="img" aria-label="history">🕑</span> View Upload History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard; 
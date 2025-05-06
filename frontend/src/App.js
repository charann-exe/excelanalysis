import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import DataMapping from './components/DataMapping';
import PrivateRoute from './components/PrivateRoute';
import UploadExcelPage from './components/UploadExcelPage';
import ChartView from './components/ChartView';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/user-dashboard"
              element={
                <PrivateRoute role="user">
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/data-mapping"
              element={
                <PrivateRoute role="user">
                  <DataMapping />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload-excel"
              element={
                <PrivateRoute role="user">
                  <UploadExcelPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/chart-view"
              element={
                <PrivateRoute role="user">
                  <ChartView />
                </PrivateRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 
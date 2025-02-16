import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './Admin';
import AdminResetPassword from './AdminResetPassword';
import AdminInputResetPassword from './AdminInputResetPassword';
import Dashboard from './AdminDashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);


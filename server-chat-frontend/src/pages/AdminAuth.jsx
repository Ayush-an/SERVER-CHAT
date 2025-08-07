import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from './ModalAndNotification.jsx';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/auth/signin`, { email, password });
      localStorage.setItem('adminToken', res.data.token);
      showNotification('Login successful!', 'success');
      navigate('/admin/dashboard');
    } catch (error) {
      showNotification('Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-sans bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-800">Admin Sign In</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-3 mt-6 font-bold text-white transition-all bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default AdminAuth;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from './ModalAndNotification.jsx';
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const UserRegister = () => {
  const [formData, setFormData] = useState({ name: '', class: '', mobile: '' });
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/register`, formData);
      localStorage.setItem('userId', res.data._id);
      showNotification('Registration successful!', 'success');
      navigate('/quiz');
    } catch (error) {
      showNotification('Registration failed.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-sans bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-800">User Registration</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input type="text" id="name" name="name" placeholder="Name" onChange={handleChange} className="w-full p-3 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="class" className="sr-only">Class</label>
            <input type="text" id="class" name="class" placeholder="Class" onChange={handleChange} className="w-full p-3 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="mobile" className="sr-only">Mobile</label>
            <input type="text" id="mobile" name="mobile" placeholder="Mobile" onChange={handleChange} className="w-full p-3 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button type="submit" className="w-full p-3 mt-6 font-bold text-white transition-all bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegister;

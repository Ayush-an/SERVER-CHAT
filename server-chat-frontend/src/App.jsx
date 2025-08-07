import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminAuth from './pages/AdminAuth.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserRegister from './pages/UserRegister.jsx';
import QuizPage from './pages/QuizPage.jsx';
import { ModalProvider, NotificationProvider } from './pages/ModalAndNotification.jsx';

// PrivateRoute component to protect the admin dashboard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <Router>
      <NotificationProvider>
        <ModalProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminAuth />} />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            
            {/* User Routes */}
            <Route path="/" element={<UserRegister />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Routes>
        </ModalProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;

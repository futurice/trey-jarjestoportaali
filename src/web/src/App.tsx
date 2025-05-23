import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { UserManagement } from './components/admin/UserManagement';
import { Box, CircularProgress } from '@mui/material';
import "./App.css"
import { Roles } from "./authentication/Roles"
import Dashboard from "./components/Dashboard"
import { Layout } from "./components/Layout/Layout"
import MyFiles from "./components/MyFiles"
import { Registration } from "./components/Registration/Registration.tsx"
import { SurveyPage } from "./components/Survey/Survey.tsx"
import { EmailVerification } from './components/auth/EmailVerification';

const approvedRoles = [Roles.ORGANISATION, Roles.TREY_BOARD, Roles.ADMIN]

const PrivateRoute: React.FC<{ children: React.ReactNode; requiredRoles?: Roles[] }> = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/my-files" element={<MyFiles />} />
                  <Route path="/surveys/:id" element={<SurveyPage />} />
                  <Route path="/admin/users" element={
                    <PrivateRoute requiredRoles={[Roles.ADMIN]}>
                      <UserManagement />
                    </PrivateRoute>
                  } />
                </Routes>
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

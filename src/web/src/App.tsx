import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Authenticated, Roles, useRefreshSession } from './authentication';
import Dashboard from './components/Dashboard';
import { Layout } from './components/Layout/Layout';
import Login from './components/Login';
import { Logout } from './components/Logout.tsx';
import MyFiles from './components/MyFiles';
import { Registration } from './components/Registration/Registration.tsx';

const approvedRoles = [Roles.ORGANISATION, Roles.TREY_BOARD, Roles.ADMIN];

const App = () => {
  useRefreshSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Authenticated requiredRoles={approvedRoles} redirectUrl={'/registration'}>
              <Layout>
                <Dashboard />
              </Layout>
            </Authenticated>
          }
        />

        <Route
          path="/my-files"
          element={
            <Authenticated requiredRoles={approvedRoles} redirectUrl={'/registration'}>
              <Layout>
                <MyFiles />
              </Layout>
            </Authenticated>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        <Route
          path="registration"
          element={
            <Authenticated requiredRoles={[Roles.NONE]} redirectUrl={'/registration'}>
              <Layout>
                <Registration />
              </Layout>
            </Authenticated>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

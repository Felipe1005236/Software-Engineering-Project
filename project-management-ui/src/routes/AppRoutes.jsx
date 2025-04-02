import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import Calendar from '../pages/Calendar';
import Team from '../pages/Team';
import Settings from '../pages/Settings';
import Stakeholders from '../pages/Stakeholders';
import TaskList from '../pages/TaskList';
import TaskDetails from '../pages/TaskDetails';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';

import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Navigate to="/login" />} />
    <Route
      path="/login"
      element={
        localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Login />
      }
    />
    <Route
      path="/signup"
      element={
        localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Signup />
      }
    />
    <Route path="/forgot" element={<ForgotPassword />} />

    {/* Protected Routes */}
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      {/* Main Pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/team" element={<Team />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/stakeholders" element={<Stakeholders />} />

      {/* Project Task Flow */}
      <Route path="/projects/:name/tasks" element={<TaskList />} />
      <Route path="/projects/:name/tasks/:id" element={<TaskDetails />} />
    </Route>

    {/* Error & Fallback Pages */}
    <Route path="/500" element={<ServerError />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;

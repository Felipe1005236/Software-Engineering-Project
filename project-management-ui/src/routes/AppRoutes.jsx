import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

// Landing Pages (no MainLayout)
import AppLanding from '../pages/AppLanding';
import LearnMore from '../pages/LearnMore';
import Pricing from '../pages/Pricing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';

// Protected Main App Pages (with MainLayout)
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import Calendar from '../pages/Calendar';
import Team from '../pages/Team';
import Settings from '../pages/Settings';
import Stakeholders from '../pages/Stakeholders';
import TaskList from '../pages/TaskList';
import TaskDetails from '../pages/TaskDetails';

import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';

import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    {/* --- Public Landing Pages --- */}
    <Route path="/" element={<AppLanding />} />
    <Route path="/learn-more" element={<LearnMore />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot" element={<ForgotPassword />} />

    {/* --- Protected Main App Pages with Layout --- */}
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/team" element={<Team />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/stakeholders" element={<Stakeholders />} />

      {/* Nested Task Routes */}
      <Route path="/projects/:name/tasks" element={<TaskList />} />
      <Route path="/projects/:name/tasks/:id" element={<TaskDetails />} />
    </Route>

    {/* --- Error and Fallback Pages --- */}
    <Route path="/500" element={<ServerError />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

// Public Pages
import AppLanding from '../pages/AppLanding';
import LearnMore from '../pages/LearnMore';
import Pricing from '../pages/Pricing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';

// Protected Pages (with MainLayout)
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import ProjectDashboard from '../pages/ProjectDashboard';
import ProjectDetails from '../pages/ProjectDetails';
import Calendar from '../pages/Calendar';
import Team from '../pages/Team';
import Settings from '../pages/Settings';
import Stakeholders from '../pages/Stakeholders';
import TaskList from '../pages/TaskList';
import TaskDetails from '../pages/TaskDetails';
import Budget from '../pages/Budget';

// Error Pages
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';

// Auth Wrapper
import ProtectedRoute from './ProtectedRoute';
import TimeTracking from '../pages/TimeTracking';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<AppLanding />} />
    <Route path="/learn-more" element={<LearnMore />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot" element={<ForgotPassword />} />

    {/* Protected Routes with Main Layout */}
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      {/* Main Pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/project-dashboard" element={<ProjectDashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/team" element={<Team />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/stakeholders" element={<Stakeholders />} />
      <Route path="/time-tracking" element={<TimeTracking />} />

      {/* Project Routes */}
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/projects/:id/tasks" element={<TaskList />} />
      <Route path="/projects/:id/tasks/:taskId" element={<TaskDetails />} />

      {/* Budget */}
      <Route path="/budget" element={<Budget />} />
    </Route>

    {/* Error Pages */}
    <Route path="/500" element={<ServerError />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
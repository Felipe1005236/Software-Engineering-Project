import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage'; // New profile page
import LoginPage from './pages/LoginPage'; // Your existing login
import NotFound from './pages/404';
import ServerError from './pages/500';

function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route
                    path="/login"
                    element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
                />

                {/* Protected Routes */}
                <Route
                    path="/account"
                    element={isAuthenticated ? <AccountPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/profile"
                    element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
                />

                {/* Error Handling */}
                <Route path="/500" element={<ServerError />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
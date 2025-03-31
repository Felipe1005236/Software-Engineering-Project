// react_frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/404';
import ServerError from './pages/500';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                {/* Add other routes here */}

                {/* 404 Catch-all Route */}
                <Route path="*" element={<NotFound />} />

                {/* Simulate a 500 Error (for testing) */}
                <Route path="/simulate-500" element={<ServerError />} />
            </Routes>
        </Router>
    );
}

export default App;
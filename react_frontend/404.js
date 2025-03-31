// react_frontend/src/pages/404.js
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
}

export default NotFound;

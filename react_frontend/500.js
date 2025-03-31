// react_frontend/src/pages/500.js
import React from 'react';
import { Link } from 'react-router-dom';

function ServerError() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>500 - Server Error</h1>
            <p>Something went wrong on our end. Please try again later.</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
}

export default ServerError;
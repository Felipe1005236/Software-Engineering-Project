// src/utils/fetchWrapper.js

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchWrapper = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url.startsWith('http') ? url : `${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Only remove token if it's an auth endpoint returning 401
      if ((url.includes('/auth/') || url === '/users/me') && response.status === 401) {
        localStorage.removeItem('token');
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchWrapper Error]', error);
    throw error;
  }
};

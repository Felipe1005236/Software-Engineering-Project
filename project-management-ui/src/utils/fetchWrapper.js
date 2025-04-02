// src/utils/fetchWrapper.js

export const fetchWrapper = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Handle common status codes
      if (response.status === 401) {
        // Unauthorized - maybe redirect to login
        window.location.href = '/login';
      } else if (response.status === 500) {
        // Server error - redirect to server error page
        window.location.href = '/500';
      }

      throw new Error(errorData.message || 'API error');
    }

    return await response.json();
  } catch (err) {
    console.error('[fetchWrapper Error]', err);
    throw err;
  }
};
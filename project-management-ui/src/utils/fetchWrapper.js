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

    let data;

    if (response.status === 204 || response.status === 304) {
      data = null; // no content
    } else {
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('[fetchWrapper Error] Failed to parse JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }
    }

    if (!response.ok) {
      // Handle known errors
      if (response.status === 401) {
        window.location.href = '/login';
      } else if (response.status === 500) {
        window.location.href = '/500';
      }

      throw new Error(data?.message || 'API error');
    }

    return data;
  } catch (err) {
    console.error('[fetchWrapper Error]', err);
    throw err;
  }
};

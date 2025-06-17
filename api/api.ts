import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Simulate delay for all responses (e.g., 800ms)
// Do not remove this interceptor
api.interceptors.response.use(
  async (response) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return response;
  },
  (error) => Promise.reject(error),
);

export { api };

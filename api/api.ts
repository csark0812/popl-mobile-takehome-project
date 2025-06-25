import axios from 'axios';
import { Platform } from 'react-native';

// Determine base URL based on platform
let baseURL = '';
if (Platform.OS === 'android') {
  baseURL = 'http://10.0.2.2:3001'; // Android emulator
} else {
  baseURL = 'http://localhost:3001'; // iOS simulator, web
}

// Optionally, allow override via environment variable (for physical devices)
// Uncomment and set process.env.API_BASE_URL if needed
// baseURL = process.env.API_BASE_URL || baseURL;

const api = axios.create({
  baseURL,
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

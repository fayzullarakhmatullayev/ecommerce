import axios from '../axios';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export class authService {
  static async login(email, password) {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem(TOKEN_KEY, token);

      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  }

  static async register(email, password, name) {
    try {
      const response = await axios.post('/auth/register', { email, password, name });
      const { token, user } = response.data;
      localStorage.setItem(TOKEN_KEY, token);

      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  }

  static logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  static isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  static async getCurrentUserProfile() {
    try {
      const response = await axios.get('/auth/me');
      const userData = response.data;
      return { success: true, user: { ...userData, isAdmin: Boolean(userData.isAdmin) } };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  }
}

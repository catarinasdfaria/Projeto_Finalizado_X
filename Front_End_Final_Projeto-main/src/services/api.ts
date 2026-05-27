import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('api_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('api_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// initialize token from storage if present
const init = () => {
  const t = localStorage.getItem('api_token');
  if (t) setToken(t);
};

init();

export default {
  base: BASE,
  setToken,

  // Auth
  async register(payload: { username: string; email: string; password: string }) {
    return api.post('/auth/register', payload).then((r) => r.data);
  },

  async login(payload: { identifier: string; password: string }) {
    return api.post('/auth/login', payload).then((r) => r.data);
  },

  async getMe() {
    return api.get('/auth/me').then((r) => r.data);
  },

  async logout() {
    return api.post('/auth/logout').then((r) => r.data);
  },

  // Tweets
  async getTweets() {
    return api.get('/tweets').then((r) => r.data);
  },

  async postTweet(payload: { message: string; image?: File | null }) {
    // if image present use multipart
    if (payload.image) {
      const fd = new FormData();
      fd.append('message', payload.message);
      fd.append('image', payload.image);
      return api.post('/tweets', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
    }
    return api.post('/tweets', { message: payload.message }).then((r) => r.data);
  },

  async likeTweet(tweetId: number) {
    return api.post(`/tweets/${tweetId}/like`).then((r) => r.data);
  },

  async followUser(userId: number) {
    return api.post(`/users/${userId}/follow`).then((r) => r.data);
  },

  // Comments
  async getComments(tweetId: number) {
    return api.get(`/tweets/${tweetId}/comments`).then((r) => r.data);
  },

  async postComment(tweetId: number, payload: { message: string }) {
    return api.post(`/tweets/${tweetId}/comments`, payload).then((r) => r.data);
  },

  // Users / Admin
  async getUsers() {
    return api.get('/users').then((r) => r.data);
  },

  async adminGetUsers() {
    return api.get('/admin/users').then((r) => r.data);
  },

  async adminUpdateUser(userId: number | string, payload: { username?: string; email?: string; role?: 'admin' | 'user' }) {
    return api.put(`/admin/users/${userId}`, payload).then((r) => r.data);
  },

  async adminDeleteUser(userId: number | string) {
    return api.delete(`/admin/users/${userId}`).then((r) => r.data);
  },

  async adminUpdateTweet(tweetId: number, payload: { message?: string; removeImage?: boolean }) {
    return api.put(`/admin/tweets/${tweetId}`, payload).then((r) => r.data);
  },

  async adminDeleteTweet(tweetId: number) {
    return api.delete(`/admin/tweets/${tweetId}`).then((r) => r.data);
  },
};

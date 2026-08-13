import { api } from './api.js';

const TOKEN_KEY = 'token';
const USER_KEY = 'currentUser';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeCurrentUser() {
  localStorage.removeItem(USER_KEY);
}

export async function login(email, password) {
  const users = await api.getAll('users');
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('Invalid credentials');
  if (password !== '123456') throw new Error('Invalid credentials');

  const token = btoa(`${user.id}:${Date.now()}`);
  setToken(token);
  setCurrentUser(user);
  return { user, token };
}

export async function register(name, email, password) {
  const users = await api.getAll('users');
  if (users.find((u) => u.email === email)) {
    throw new Error('Email already exists');
  }
  const newUser = await api.create('users', { name, email, role: 'developer' });
  const token = btoa(`${newUser.id}:${Date.now()}`);
  setToken(token);
  setCurrentUser(newUser);
  return { user: newUser, token };
}

export function logout() {
  removeToken();
  removeCurrentUser();
}

export function isAuthenticated() {
  return !!getToken();
}

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.hash = '#login';
    throw new Error('Unauthorized');
  }
}

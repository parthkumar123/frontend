/**
 * Simple API configuration file
 * This file centralizes all API endpoints
 */

// Simple API base URL - using a fixed value from environment
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Task endpoints
export const TASK_ENDPOINTS = {
    GET_ALL: `${API_BASE_URL}/tasks`,
    CREATE: `${API_BASE_URL}/tasks`,
    UPDATE: (id) => `${API_BASE_URL}/tasks/${id}`,
    DELETE: (id) => `${API_BASE_URL}/tasks/${id}`,
};

// Authentication endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
};

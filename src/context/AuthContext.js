'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_ENDPOINTS } from '../config/api';

// Create Authentication Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); useEffect(() => {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('authToken');

        if (token) {
            // Here you would typically validate the token with your backend
            // For now, we'll just assume it's valid if it exists
            try {
                // You could add token validation here if needed
                // For example, checking token expiration or making a validation API call

                setUser({ isAuthenticated: true, token });
            } catch (error) {
                console.error('Error validating token:', error);
                // If token validation fails, remove the invalid token
                localStorage.removeItem('authToken');
                setUser(null);
            }
        }

        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to login');
            }

            const data = await response.json();

            // Store the token
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                setUser({ isAuthenticated: true, token: data.token, ...data.user });
                return { success: true };
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Signup function
    const signup = async (email, password, name) => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.SIGNUP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to sign up');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Forgot password function
    const forgotPassword = async (email) => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send password reset link');
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Reset password function
    const resetPassword = async (token, password) => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reset password');
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Refresh token function - useful for token expiration
    const refreshToken = async () => {
        try {
            const token = localStorage.getItem('authToken');

            if (!token) {
                return { success: false, error: 'No token found' };
            }

            const response = await fetch(AUTH_ENDPOINTS.REFRESH_TOKEN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // If token refresh fails, log out the user
                localStorage.removeItem('authToken');
                setUser(null);
                return { success: false, error: 'Failed to refresh token' };
            }

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('authToken', data.token);
                setUser({ isAuthenticated: true, token: data.token, ...data.user });
                return { success: true };
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    // Check if the user is authenticated
    const isAuthenticated = !!user?.isAuthenticated; return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                refreshToken,
                forgotPassword,
                resetPassword,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TASK_ENDPOINTS } from '../config/api';

// Create Task Context
const TaskContext = createContext();

// Initial state for tasks
const initialState = {
    tasks: [],
    statistics: {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
    },
    loading: false,
    error: null,
};

// Task reducer function
const taskReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_TASKS':
            return {
                ...state,
                tasks: action.payload,
                statistics: calculateStatistics(action.payload),
                loading: false,
                error: null,
            };
        case 'ADD_TASK_SUCCESS':
            const updatedTasksAdd = [...state.tasks, action.payload];
            return {
                ...state,
                tasks: updatedTasksAdd,
                statistics: calculateStatistics(updatedTasksAdd),
                loading: false,
                error: null,
            };
        case 'UPDATE_TASK_SUCCESS':
            const updatedTasks = state.tasks.map((task) =>
                task._id === action.payload._id ? action.payload : task
            );
            return {
                ...state,
                tasks: updatedTasks,
                statistics: calculateStatistics(updatedTasks),
                loading: false,
                error: null,
            };
        case 'DELETE_TASK_SUCCESS':
            const filteredTasks = state.tasks.filter((task) => task._id !== action.payload);
            return {
                ...state,
                tasks: filteredTasks,
                statistics: calculateStatistics(filteredTasks),
                loading: false,
                error: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

// Helper function to calculate statistics
const calculateStatistics = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const pending = tasks.filter((task) => task.status === 'pending').length;
    const overdue = tasks.filter((task) => {
        if (task.status !== 'completed' && task.dueDate) {
            return new Date(task.dueDate) < new Date();
        }
        return false;
    }).length;

    return { total, completed, pending, overdue };
};

// TaskProvider component
export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    // Function to get authentication token
    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    // Fetch all tasks from API
    const fetchTasks = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(TASK_ENDPOINTS.GET_ALL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch tasks');
            }

            const data = await response.json();
            dispatch({ type: 'FETCH_TASKS', payload: data });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    // Add a new task via API
    const addTask = async (task) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(TASK_ENDPOINTS.CREATE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create task');
            }

            const newTask = await response.json();
            dispatch({ type: 'ADD_TASK_SUCCESS', payload: newTask });
            return newTask;
        } catch (error) {
            console.error('Error creating task:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    // Update a task via API
    const updateTask = async (task) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(TASK_ENDPOINTS.UPDATE(task._id), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update task');
            }

            const updatedTask = await response.json();
            dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: updatedTask });
            return updatedTask;
        } catch (error) {
            console.error('Error updating task:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    // Delete a task via API
    const deleteTask = async (taskId) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(TASK_ENDPOINTS.DELETE(taskId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete task');
            }

            dispatch({ type: 'DELETE_TASK_SUCCESS', payload: taskId });
        } catch (error) {
            console.error('Error deleting task:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    // Load tasks from API on initial render
    useEffect(() => {
        fetchTasks();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TaskContext.Provider
            value={{
                tasks: state.tasks,
                statistics: state.statistics,
                loading: state.loading,
                error: state.error,
                fetchTasks,
                addTask,
                updateTask,
                deleteTask
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

// Custom hook to use the task context
export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
            };
        case 'ADD_TASK':
            const updatedTasksAdd = [...state.tasks, action.payload];
            return {
                ...state,
                tasks: updatedTasksAdd,
                statistics: calculateStatistics(updatedTasksAdd),
            };
        case 'UPDATE_TASK':
            const updatedTasks = state.tasks.map((task) =>
                task.id === action.payload.id ? action.payload : task
            );
            return {
                ...state,
                tasks: updatedTasks,
                statistics: calculateStatistics(updatedTasks),
            };
        case 'DELETE_TASK':
            const filteredTasks = state.tasks.filter((task) => task.id !== action.payload);
            return {
                ...state,
                tasks: filteredTasks,
                statistics: calculateStatistics(filteredTasks),
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

    // Load tasks from local storage on initial render
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            dispatch({ type: 'FETCH_TASKS', payload: JSON.parse(storedTasks) });
        } else {
            // Sample data for demonstration
            const sampleTasks = [
                {
                    id: '1',
                    title: 'Complete Project Proposal',
                    description: 'Draft and submit the project proposal with timeline',
                    status: 'completed',
                    priority: 'high',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'work'
                },
                {
                    id: '2',
                    title: 'Review Pull Requests',
                    description: 'Review and merge team pull requests',
                    status: 'pending',
                    priority: 'medium',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'development'
                },
                {
                    id: '3',
                    title: 'Team Meeting',
                    description: 'Weekly team sync up',
                    status: 'pending',
                    priority: 'high',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
                    category: 'meeting'
                },
                {
                    id: '4',
                    title: 'Client Call',
                    description: 'Monthly progress update with client',
                    status: 'pending',
                    priority: 'high',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'meeting'
                },
                {
                    id: '5',
                    title: 'Update Documentation',
                    description: 'Update project wiki with latest changes',
                    status: 'completed',
                    priority: 'low',
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'documentation'
                }
            ];

            dispatch({ type: 'FETCH_TASKS', payload: sampleTasks });
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        }
    }, []);

    // Save tasks to local storage whenever tasks change
    useEffect(() => {
        if (state.tasks.length > 0) {
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
    }, [state.tasks]);

    // Function to add a new task
    const addTask = (task) => {
        const newTask = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_TASK', payload: newTask });
    };

    // Function to update a task
    const updateTask = (task) => {
        dispatch({ type: 'UPDATE_TASK', payload: task });
    };

    // Function to delete a task
    const deleteTask = (taskId) => {
        dispatch({ type: 'DELETE_TASK', payload: taskId });
    };

    return (
        <TaskContext.Provider
            value={{
                tasks: state.tasks,
                statistics: state.statistics,
                loading: state.loading,
                error: state.error,
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

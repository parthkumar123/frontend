'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { TaskProvider } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Only render the dashboard if authenticated
    return isAuthenticated ? (
        <TaskProvider>
            <DashboardLayout />
        </TaskProvider>
    ) : null;
}

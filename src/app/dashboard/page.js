'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { TaskProvider } from '@/context/TaskContext';

export default function DashboardPage() {
    return (
        <TaskProvider>
            <DashboardLayout />
        </TaskProvider>
    );
}

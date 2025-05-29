'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskStatistics from './TaskStatistics';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const DashboardLayout = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setSelectedTask(null);
        setIsEditing(false);
    }; return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* Statistics Section - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <TaskStatistics />
            </div>

            {/* Task Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="border shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">Task Management</h2>
                        </div>
                        <div className="p-4">
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                                    <TabsTrigger value="pending">Pending</TabsTrigger>
                                    <TabsTrigger value="completed">Completed</TabsTrigger>
                                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                                </TabsList>
                                <TabsContent value="all" className="mt-4">
                                    <TaskList filter="all" onEditTask={handleEditTask} />
                                </TabsContent>
                                <TabsContent value="pending" className="mt-4">
                                    <TaskList filter="pending" onEditTask={handleEditTask} />
                                </TabsContent>
                                <TabsContent value="completed" className="mt-4">
                                    <TaskList filter="completed" onEditTask={handleEditTask} />
                                </TabsContent>
                                <TabsContent value="overdue" className="mt-4">
                                    <TaskList filter="overdue" onEditTask={handleEditTask} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </Card>
                </div>
                <div>
                    <Card className="border shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                {isEditing ? 'Edit Task' : 'Add New Task'}
                            </h2>
                        </div>
                        <div className="p-4">
                            <TaskForm
                                task={selectedTask}
                                isEditing={isEditing}
                                onCancel={handleCancelEdit}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;

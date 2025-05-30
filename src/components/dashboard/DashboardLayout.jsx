'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import TaskStatistics from './TaskStatistics';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const DashboardLayout = () => {
    const { loading, error, fetchTasks } = useTaskContext();
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setSelectedTask(null);
        setIsEditing(false);
    };

    const handleRefresh = () => {
        fetchTasks();
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex justify-between items-center">
                    <span>Error: {error}</span>
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                        <RefreshCcw className="h-4 w-4 mr-1" /> Retry
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <TaskStatistics />
            </div>

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

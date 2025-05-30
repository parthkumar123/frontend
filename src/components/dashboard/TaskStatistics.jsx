'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskContext } from '@/context/TaskContext';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

const TaskStatistics = () => {
    const { tasks, statistics, loading } = useTaskContext();

    // For Priority Chart
    const priorityCounts = tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});

    const priorityData = Object.keys(priorityCounts).map(priority => {
        const colorMap = {
            high: '#ef4444',
            medium: '#f97316',
            low: '#22c55e'
        };

        return {
            name: priority.charAt(0).toUpperCase() + priority.slice(1),
            value: priorityCounts[priority],
            color: colorMap[priority] || '#8884d8'
        };
    });

    // For Category Chart
    const categoryCounts = tasks.reduce((acc, task) => {
        const category = task.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const colorPalette = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#84cc16', '#14b8a6'];

    const categoryData = Object.keys(categoryCounts).map((category, index) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: categoryCounts[category],
        color: colorPalette[index % colorPalette.length]
    }));

    // Show loading skeleton if data is loading
    if (loading) {
        return (
            <>
                <Card className="col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle>Task Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-40">
                        <div className="animate-pulse flex space-x-4 w-full">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle>Weekly Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-60">
                        <div className="animate-pulse flex space-x-4 w-full">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-40 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </>
        );
    }

    return (
        <>
            {/* Task Overview Card with Progress */}
            <Card className="col-span-3">
                <CardHeader className="pb-2">
                    <CardTitle>Task Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg border">
                            <span className="text-sm font-medium text-muted-foreground mb-2">Completed</span>
                            <div className="relative h-20 w-20">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold">{statistics.completed}</span>
                                </div>
                                <svg className="h-20 w-20" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="2"></circle>
                                    <circle
                                        cx="18" cy="18" r="16" fill="none" stroke="#16a34a" strokeWidth="2"
                                        strokeDasharray={`${(statistics.completed / statistics.total) * 100}, 100`}
                                        transform="rotate(-90 18 18)"
                                    ></circle>
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg border">
                            <span className="text-sm font-medium text-muted-foreground mb-2">Pending</span>
                            <div className="relative h-20 w-20">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold">{statistics.pending}</span>
                                </div>
                                <svg className="h-20 w-20" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="2"></circle>
                                    <circle
                                        cx="18" cy="18" r="16" fill="none" stroke="#eab308" strokeWidth="2"
                                        strokeDasharray={`${(statistics.pending / statistics.total) * 100}, 100`}
                                        transform="rotate(-90 18 18)"
                                    ></circle>
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg border">
                            <span className="text-sm font-medium text-muted-foreground mb-2">Overdue</span>
                            <div className="relative h-20 w-20">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold">{statistics.overdue}</span>
                                </div>
                                <svg className="h-20 w-20" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="2"></circle>
                                    <circle
                                        cx="18" cy="18" r="16" fill="none" stroke="#dc2626" strokeWidth="2"
                                        strokeDasharray={`${(statistics.overdue / statistics.total) * 100}, 100`}
                                        transform="rotate(-90 18 18)"
                                    ></circle>
                                </svg>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Task Priority Distribution */}
            <Card className="col-span-3 md:col-span-2">
                <CardHeader className="pb-2">
                    <CardTitle>Task Priority Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={priorityData}
                                margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={70} />
                                <Tooltip
                                    formatter={(value, name, props) => [`${value} tasks`, props.payload.name]}
                                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Task Category Distribution */}
            <Card className="col-span-3 md:col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                                    }
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => [`${value} tasks`, props.payload.name]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default TaskStatistics;

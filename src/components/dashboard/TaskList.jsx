'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Check, Clock, Edit, MoreHorizontal, RefreshCcw, Trash2 } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { format, parseISO, isAfter } from 'date-fns';

const TaskList = ({ filter = 'all', onEditTask }) => {
    const { tasks, updateTask, deleteTask, loading, error, fetchTasks } = useTaskContext();
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [actionLoading, setActionLoading] = useState({
        toggle: null,
        delete: null
    });

    // Filter tasks
    const getFilteredTasks = () => {
        let filteredTasks = [...tasks];

        if (filter === 'pending') {
            filteredTasks = filteredTasks.filter(task => task.status === 'pending');
        } else if (filter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.status === 'completed');
        } else if (filter === 'overdue') {
            filteredTasks = filteredTasks.filter(task =>
                task.status !== 'completed' &&
                task.dueDate &&
                isAfter(new Date(), parseISO(task.dueDate))
            );
        }

        // Sort tasks
        filteredTasks.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filteredTasks;
    };

    const filteredTasks = getFilteredTasks();

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle task completion toggle
    const handleToggleStatus = async (task) => {
        try {
            setActionLoading(prev => ({ ...prev, toggle: task._id }));
            const updatedTask = {
                ...task,
                status: task.status === 'completed' ? 'pending' : 'completed'
            };
            await updateTask(updatedTask);
        } catch (error) {
            console.error('Error updating task status:', error);
        } finally {
            setActionLoading(prev => ({ ...prev, toggle: null }));
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        try {
            setActionLoading(prev => ({ ...prev, delete: taskId }));
            await deleteTask(taskId);
        } catch (error) {
            console.error('Error deleting task:', error);
        } finally {
            setActionLoading(prev => ({ ...prev, delete: null }));
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchTasks();
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm flex justify-between items-center">
                    <span>Error loading tasks: {error}</span>
                    <Button size="sm" variant="ghost" onClick={handleRefresh}>
                        <RefreshCcw className="h-4 w-4 mr-1" /> Retry
                    </Button>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Status</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => requestSort('title')}>
                                Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </TableHead>
                            <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => requestSort('priority')}>
                                Priority {sortConfig.key === 'priority' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </TableHead>
                            <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => requestSort('dueDate')}>
                                Due Date {sortConfig.key === 'dueDate' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                                        <span className="ml-2">Loading tasks...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredTasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No tasks found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTasks.map((task) => (
                                <TableRow key={task._id}>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleToggleStatus(task)}
                                            disabled={actionLoading.toggle === task._id}
                                        >
                                            {actionLoading.toggle === task._id ? (
                                                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary rounded-full"></div>
                                            ) : task.status === 'completed' ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-amber-600" />
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                                            {task.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground hidden sm:block mt-1">{task.description}</div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge
                                            variant={
                                                task.priority === 'high' ? 'destructive' :
                                                    task.priority === 'medium' ? 'default' :
                                                        'outline'
                                            }
                                        >
                                            {task.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {task.dueDate ? (
                                            <div className={
                                                task.status !== 'completed' && isAfter(new Date(), parseISO(task.dueDate))
                                                    ? 'text-red-600 font-medium'
                                                    : ''
                                            }>
                                                {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">No due date</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={actionLoading.delete === task._id}>
                                                    {actionLoading.delete === task._id ? (
                                                        <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary rounded-full"></div>
                                                    ) : (
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEditTask(task)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteTask(task._id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TaskList;

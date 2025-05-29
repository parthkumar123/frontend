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
import { Check, Clock, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { format, parseISO, isAfter } from 'date-fns';

const TaskList = ({ filter = 'all', onEditTask }) => {
    const { tasks, updateTask, deleteTask } = useTaskContext();
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

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
    const handleToggleStatus = (task) => {
        const updatedTask = {
            ...task,
            status: task.status === 'completed' ? 'pending' : 'completed'
        };
        updateTask(updatedTask);
    };

    return (
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
                    {filteredTasks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                No tasks found
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredTasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleToggleStatus(task)}
                                    >
                                        {task.status === 'completed' ? (
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
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
                                                onClick={() => deleteTask(task.id)}
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
    );
};

export default TaskList;

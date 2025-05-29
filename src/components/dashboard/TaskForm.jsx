'use client';

import { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

const TaskForm = ({ task, isEditing, onCancel }) => {
    const { addTask, updateTask } = useTaskContext();

    const initialFormState = {
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        category: 'work',
        dueDate: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Update form when editing an existing task
    useEffect(() => {
        if (isEditing && task) {
            setFormData({
                ...task,
                dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
            });
        } else {
            setFormData(initialFormState);
        }
    }, [isEditing, task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format the data
        const taskData = {
            ...formData,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
        };

        if (isEditing) {
            updateTask(taskData);
        } else {
            addTask(taskData);
        }

        // Reset form
        setFormData(initialFormState);
        if (isEditing && onCancel) {
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Task title"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Task description"
                        className="resize-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">
                        Priority
                    </label>
                    <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange('priority', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                        Category
                    </label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="documentation">Documentation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isEditing && (
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium mb-1">
                            Status
                        </label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleSelectChange('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                        Due Date
                    </label>
                    <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit">
                        {isEditing ? 'Update Task' : 'Add Task'}
                    </Button>
                    {isEditing && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default TaskForm;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
    const { user, isAuthenticated, loading, refreshToken } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        } else if (user) {
            // Set initial profile data from user object
            setProfileData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [isAuthenticated, loading, user, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setError(null);
            setSuccess(false);
            setIsSaving(true);

            // Simulate API call to save profile
            // In a real app, you would call your backend API
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess(true);
            setIsEditing(false);

            // Refresh token to update user data
            await refreshToken();
        } catch (err) {
            setError('Failed to update profile');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="container max-w-4xl py-10">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                            {isEditing
                                ? 'Update your personal details'
                                : 'View and manage your account information'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm">
                                Profile updated successfully!
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            {isEditing ? (
                                <Input
                                    id="name"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    disabled={isSaving}
                                />
                            ) : (
                                <div className="p-2 bg-muted rounded-md">{profileData.name}</div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            {isEditing ? (
                                <Input
                                    id="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    disabled={isSaving}
                                />
                            ) : (
                                <div className="p-2 bg-muted rounded-md">{profileData.email}</div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Account Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-2xl">
                                {profileData.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="font-medium">{profileData.name || 'User'}</h3>
                            <p className="text-sm text-muted-foreground">{profileData.email}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

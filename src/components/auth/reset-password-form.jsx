"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function ResetPasswordForm({ token }) {
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(null);
    const router = useRouter();
    const { resetPassword } = useAuth();

    // Validate that we have a token
    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token. Please request a new password reset link.");
        }
    }, [token]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    async function onSubmit(data) {
        try {
            setError(null);

            if (!token) {
                throw new Error("Invalid or missing reset token");
            }

            const result = await resetPassword(token, data.password);

            if (result.success) {
                setSuccess(true);
                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                throw new Error(result.error || 'Failed to reset password');
            }
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.message || 'An error occurred during password reset');
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Create a new password for your account
                </CardDescription>
            </CardHeader>

            {success ? (
                <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    Your password has been reset successfully. Redirecting to login...
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Link href="/login">
                            <Button variant="outline">Go to Login</Button>
                        </Link>
                    </div>
                </CardContent>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                disabled={!token || isSubmitting}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword")}
                                disabled={!token || isSubmitting}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!token || isSubmitting}
                        >
                            {isSubmitting ? "Resetting password..." : "Reset Password"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Remember your password?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            )}
        </Card>
    );
}

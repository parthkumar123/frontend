"use client";

import React from "react";
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
import { useAuth } from "@/context/AuthContext";

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordForm() {
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [error, setError] = React.useState(null);
    const { forgotPassword } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    async function onSubmit(data) {
        try {
            setError(null);

            const result = await forgotPassword(data.email);

            if (result.success) {
                setIsSubmitted(true);
            } else {
                throw new Error(result.error || 'Failed to send reset link');
            }
        } catch (err) {
            console.error('Password reset request error:', err);
            setError(err.message || 'An error occurred while sending the reset link');
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Enter your email address and we'll send you a link to reset your password
                </CardDescription>
            </CardHeader>

            {isSubmitted ? (
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
                                    Password reset link has been sent to your email address.
                                </p>
                            </div>
                        </div>
                    </div>
                    <CardFooter className="flex justify-center px-0 pt-4">
                        <Link href="/login">
                            <Button variant="outline">Return to login</Button>
                        </Link>
                    </CardFooter>
                </CardContent>
            ) : (<form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending reset link..." : "Send reset link"}
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

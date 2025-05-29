"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

export function NavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="border-b">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/dashboard" className="text-xl font-semibold">
                        Dev Board
                    </Link>
                    {isAuthenticated && (
                        <nav className="hidden md:flex gap-6 ml-6">
                            <Link
                                href="/dashboard"
                                className={
                                    pathname === "/dashboard"
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground"
                                }
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/profile"
                                className={
                                    pathname === "/profile"
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground"
                                }
                            >
                                Profile
                            </Link>
                        </nav>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {!isAuthenticated && pathname !== "/login" && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                    {!isAuthenticated && pathname !== "/signup" && (
                        <Button size="sm" asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    )}
                    {isAuthenticated && (
                        <>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/profile">My Profile</Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    logout();
                                    router.push('/login');
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

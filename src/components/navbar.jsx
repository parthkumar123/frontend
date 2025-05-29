"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function NavBar() {
    const pathname = usePathname();

    // This would be replaced with your auth check logic
    const isAuthenticated = true; // Changed to true for development purposes

    return (
        <header className="border-b">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/" className="text-xl font-semibold">
                        Dev Board
                    </Link>
                    {isAuthenticated && (
                        <nav className="hidden md:flex gap-6 ml-6">
                            <Link
                                href="/"
                                className={
                                    pathname === "/"
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground"
                                }
                            >
                                Home
                            </Link>
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                // Handle logout
                                console.log("Logout clicked");
                            }}
                        >
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}

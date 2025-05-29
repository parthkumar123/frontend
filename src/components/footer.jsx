"use client";

import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {currentYear} Your Company. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                        Terms
                    </Link>
                    <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                        Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
}

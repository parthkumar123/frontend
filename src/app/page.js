import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to Our Platform
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A secure and modern authentication system built with Next.js and Shadcn UI
            </p>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-2">
              Includes a dashboard with task management and visualizations.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
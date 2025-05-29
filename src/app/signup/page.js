import SignupForm from "@/components/auth/signup-form";

export const metadata = {
    title: "Sign Up",
    description: "Create a new account",
};

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <SignupForm />
            </div>
        </div>
    );
}

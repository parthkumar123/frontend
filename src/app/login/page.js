import LoginForm from "@/components/auth/login-form";

export const metadata = {
    title: "Login",
    description: "Login to your account",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}

import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata = {
    title: "Forgot Password",
    description: "Reset your password",
};

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}

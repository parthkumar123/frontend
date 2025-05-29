'use client';

import React, { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/reset-password-form';
import { useSearchParams } from 'next/navigation';

// Client Component that uses the search params
function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <ResetPasswordForm token={token} />
        </div>
    );
}

// Loading fallback for Suspense
function LoadingFallback() {
    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="animate-pulse bg-gray-200 h-80 rounded-md"></div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Suspense fallback={<LoadingFallback />}>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}

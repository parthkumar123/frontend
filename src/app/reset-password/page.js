'use client';

import React from 'react';
import ResetPasswordForm from '@/components/auth/reset-password-form';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}

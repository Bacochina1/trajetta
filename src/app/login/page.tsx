'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTrajetta } from '@/context/TrajettaContext';
import { AuthGateView } from '@/components/views/AuthGateView';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading, login } = useTrajetta();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/app');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060709] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#B8FF00] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#8E9499] uppercase tracking-wider">Verificando sessão...</span>
      </div>
    );
  }

  return (
    <AuthGateView
      initialMode="login"
      onLoginSuccess={(userData) => {
        login(userData);
        router.replace('/app');
      }}
    />
  );
}

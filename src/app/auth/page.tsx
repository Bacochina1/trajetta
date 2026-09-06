'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#060709] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#B8FF00] border-t-transparent animate-spin" />
      <span className="text-xs font-mono text-[#8E9499] uppercase tracking-wider">Redirecionando...</span>
    </div>
  );
}

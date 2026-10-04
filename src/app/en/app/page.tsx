'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EnAppRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      localStorage.setItem('trajetta_locale', 'en');
      document.cookie = 'trajetta_locale=en; path=/; max-age=31536000; SameSite=Lax';
    } catch {}
    router.replace('/app?lang=en');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0D0F10] text-[#F2F1ED] flex items-center justify-center">
      <div className="flex items-center gap-3 text-xs font-mono text-[#8E9499]">
        <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse" />
        <span>Loading Trajetta App in English...</span>
      </div>
    </div>
  );
}

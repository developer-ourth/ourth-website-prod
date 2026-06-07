"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

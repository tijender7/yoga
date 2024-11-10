'use client'

import { Suspense } from 'react';
import AdvancedAuthTabs from '@/components/ui/AdvancedAuthTabs';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <AdvancedAuthTabs />
        </Suspense>
      </div>
    </div>
  );
}

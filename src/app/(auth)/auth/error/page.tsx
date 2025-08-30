"use client";

import { Suspense, lazy } from 'react';

const AuthErrorContent = lazy(() => import('./AuthErrorContent'));

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}

"use client";

import { Suspense, lazy } from "react";

const LoginPageContent = lazy(() => import('./LoginPageContent'));

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
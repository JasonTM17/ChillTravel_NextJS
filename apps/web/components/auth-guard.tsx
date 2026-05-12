"use client";

/**
 * AuthGuard component — Design §6.3
 * Renders children if the user is authorized.
 * - Not authenticated → redirect to /login
 * - Wrong role → redirect to / (or show 403 inline)
 * - Loading → spinner
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN" | "STAFF";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, isAdmin, isStaff, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requiredRole === "ADMIN" && !isAdmin) {
      router.replace("/");
      return;
    }

    if (requiredRole === "STAFF" && !isStaff) {
      router.replace("/");
      return;
    }
  }, [isLoading, isAuthenticated, isAdmin, isStaff, requiredRole, router]);

  // Loading state — show spinner while auth is being resolved
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Not authenticated — render nothing while redirect fires
  if (!isAuthenticated) {
    return null;
  }

  // Wrong role — show 403 inline while redirect fires
  if (requiredRole === "ADMIN" && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-red-600">
          403 — Không có quyền truy cập
        </h1>
        <p className="text-gray-600">
          Bạn cần quyền Admin để xem trang này.
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          Về trang chủ
        </a>
      </div>
    );
  }

  if (requiredRole === "STAFF" && !isStaff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-red-600">
          403 — Không có quyền truy cập
        </h1>
        <p className="text-gray-600">
          Bạn cần quyền Staff để xem trang này.
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          Về trang chủ
        </a>
      </div>
    );
  }

  return <>{children}</>;
}

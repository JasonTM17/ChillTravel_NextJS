'use client';

/**
 * Admin layout — wraps all /admin/* routes with AuthGuard.
 * Only users with ADMIN role can access these pages (Design §6.3).
 */

import { AuthGuard } from '@/components/auth-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="ADMIN">{children}</AuthGuard>;
}

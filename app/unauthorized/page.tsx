'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function UnauthorizedPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-900">
              You do not have permission to access the WhatsApp Manager.
            </p>
            <p className="mt-2 text-xs text-red-700">
              This dashboard is restricted to users with <strong>super_admin</strong> role only.
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleLogout} variant="default" className="w-full">
              Sign Out
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Go to Home
            </Button>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs text-zinc-600">
              If you believe you should have access, please contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

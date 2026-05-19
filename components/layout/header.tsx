'use client';

import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user?: {
    email?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">
          WhatsApp Management
        </h1>
        <p className="text-sm text-zinc-500">
          Manage your WhatsApp messages and campaigns
        </p>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <User className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

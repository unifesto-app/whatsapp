'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  Inbox,
  FileText,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { gradientText } from '@/lib/styles';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Send Message', href: '/messages/send', icon: Send },
  { name: 'Inbox', href: '/messages/inbox', icon: Inbox },
  { name: 'Logs', href: '/messages', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:block w-64 border-r bg-muted/10 h-full overflow-y-auto">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl -mt-1 font-logo" style={gradientText}>
            unifesto
          </h1>
          <span className="text-sm text-muted-foreground">WhatsApp</span>
        </div>
      </div>
      <div className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

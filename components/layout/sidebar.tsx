'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  Inbox,
  FileText,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
    <div className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <MessageSquare className="h-6 w-6 text-zinc-900" />
        <span className="ml-2 text-lg font-semibold text-zinc-900">
          WhatsApp Manager
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 p-4">
        <p className="text-xs text-zinc-500">Unifesto WhatsApp</p>
        <p className="text-xs text-zinc-400">v1.0.0</p>
      </div>
    </div>
  );
}

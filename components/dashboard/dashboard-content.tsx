'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { whatsappAPI, MessageStats } from '@/lib/api/whatsapp-api';
import { Send, CheckCheck, XCircle, Eye } from 'lucide-react';

export function DashboardContent() {
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const response = await whatsappAPI.getStats();
    if (response.success && response.data) {
      setStats(response.data);
    } else {
      setError(response.error || 'Failed to load stats');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 animate-pulse rounded bg-zinc-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sent',
      value: stats?.total_sent || 0,
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Delivered',
      value: stats?.delivered || 0,
      icon: CheckCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Failed',
      value: stats?.failed || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Read',
      value: stats?.read || 0,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500">Overview of your WhatsApp messaging</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <a
            href="/messages/send"
            className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 p-6 transition-colors hover:bg-zinc-50"
          >
            <Send className="mb-2 h-8 w-8 text-zinc-600" />
            <span className="font-medium text-zinc-900">Send Message</span>
          </a>
          <a
            href="/messages/inbox"
            className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 p-6 transition-colors hover:bg-zinc-50"
          >
            <Eye className="mb-2 h-8 w-8 text-zinc-600" />
            <span className="font-medium text-zinc-900">View Inbox</span>
          </a>
          <a
            href="/messages"
            className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 p-6 transition-colors hover:bg-zinc-50"
          >
            <CheckCheck className="mb-2 h-8 w-8 text-zinc-600" />
            <span className="font-medium text-zinc-900">Message Logs</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

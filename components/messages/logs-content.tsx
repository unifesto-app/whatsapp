'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { whatsappAPI, Message } from '@/lib/api/whatsapp-api';
import { format } from 'date-fns';
import { CheckCheck, Check, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function LogsContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const response = await whatsappAPI.getMessages(100);
    if (response.success && response.data) {
      setMessages(response.data);
    } else {
      setError(response.error || 'Failed to load messages');
    }
    setLoading(false);
  };

  const getStatusBadge = (status: Message['status']) => {
    const styles = {
      sent: 'bg-blue-100 text-blue-700',
      delivered: 'bg-green-100 text-green-700',
      read: 'bg-purple-100 text-purple-700',
      failed: 'bg-red-100 text-red-700',
    };

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}
      >
        {status === 'sent' && <Check className="h-3 w-3" />}
        {status === 'delivered' && <CheckCheck className="h-3 w-3" />}
        {status === 'read' && <CheckCheck className="h-3 w-3" />}
        {status === 'failed' && <X className="h-3 w-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <p className="mt-2 text-sm text-zinc-500">Loading logs...</p>
        </div>
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Message Logs</h2>
        <p className="text-zinc-500">View all message history and status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-zinc-500">No messages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-sm font-medium text-zinc-500">
                    <th className="pb-3">Direction</th>
                    <th className="pb-3">From/To</th>
                    <th className="pb-3">Message</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Event ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="text-sm">
                      <td className="py-3">
                        {msg.direction === 'outbound' ? (
                          <div className="flex items-center gap-1 text-blue-600">
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="text-xs">Sent</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowDownLeft className="h-4 w-4" />
                            <span className="text-xs">Received</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 font-mono text-xs text-zinc-600">
                        {msg.direction === 'outbound' ? msg.to : msg.from}
                      </td>
                      <td className="max-w-xs truncate py-3 text-zinc-900">
                        {msg.message}
                      </td>
                      <td className="py-3">{getStatusBadge(msg.status)}</td>
                      <td className="py-3 text-zinc-500">
                        {format(new Date(msg.timestamp), 'MMM dd, HH:mm')}
                      </td>
                      <td className="py-3 font-mono text-xs text-zinc-500">
                        {msg.event_id || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

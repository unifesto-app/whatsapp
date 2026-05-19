'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { whatsappAPI, Message } from '@/lib/api/whatsapp-api';
import { format } from 'date-fns';
import { MessageSquare, User, Clock, CheckCheck, Check, X } from 'lucide-react';

interface MessageGroup {
  phone: string;
  messages: Message[];
  lastMessage: Message;
}

export function InboxContent() {
  const [groups, setGroups] = useState<MessageGroup[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const response = await whatsappAPI.getMessages(100);
    if (response.success && response.data) {
      const grouped = groupMessagesByPhone(response.data);
      setGroups(grouped);
      if (grouped.length > 0) {
        setSelectedPhone(grouped[0].phone);
      }
    } else {
      setError(response.error || 'Failed to load messages');
    }
    setLoading(false);
  };

  const groupMessagesByPhone = (messages: Message[]): MessageGroup[] => {
    const grouped = messages.reduce((acc, msg) => {
      const phone = msg.direction === 'inbound' ? msg.from : msg.to;
      if (!acc[phone]) {
        acc[phone] = [];
      }
      acc[phone].push(msg);
      return acc;
    }, {} as Record<string, Message[]>);

    return Object.entries(grouped)
      .map(([phone, messages]) => ({
        phone,
        messages: messages.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
        lastMessage: messages[messages.length - 1],
      }))
      .sort(
        (a, b) =>
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
      );
  };

  const selectedMessages =
    groups.find((g) => g.phone === selectedPhone)?.messages || [];

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-zinc-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-zinc-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <X className="h-3 w-3 text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <p className="mt-2 text-sm text-zinc-500">Loading messages...</p>
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
        <h2 className="text-2xl font-bold text-zinc-900">Inbox</h2>
        <p className="text-zinc-500">View and manage your conversations</p>
      </div>

      <div className="grid h-[calc(100vh-12rem)] grid-cols-3 gap-4">
        {/* Conversations List */}
        <Card className="col-span-1 overflow-hidden">
          <div className="border-b border-zinc-200 p-4">
            <h3 className="font-semibold text-zinc-900">Conversations</h3>
          </div>
          <div className="overflow-y-auto">
            {groups.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-zinc-300" />
                <p className="mt-2 text-sm text-zinc-500">No messages yet</p>
              </div>
            ) : (
              groups.map((group) => (
                <button
                  key={group.phone}
                  onClick={() => setSelectedPhone(group.phone)}
                  className={`w-full border-b border-zinc-100 p-4 text-left transition-colors hover:bg-zinc-50 ${
                    selectedPhone === group.phone ? 'bg-zinc-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200">
                      <User className="h-5 w-5 text-zinc-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-zinc-900">
                          {group.phone}
                        </p>
                        <span className="text-xs text-zinc-500">
                          {format(
                            new Date(group.lastMessage.timestamp),
                            'HH:mm'
                          )}
                        </span>
                      </div>
                      <p className="truncate text-sm text-zinc-500">
                        {group.lastMessage.message}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Messages */}
        <Card className="col-span-2 flex flex-col overflow-hidden">
          {selectedPhone ? (
            <>
              <div className="border-b border-zinc-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200">
                    <User className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">
                      {selectedPhone}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {selectedMessages.length} messages
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {selectedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.direction === 'outbound'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.direction === 'outbound'
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs opacity-70">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(msg.timestamp), 'HH:mm')}
                        </span>
                        {msg.direction === 'outbound' && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-zinc-300" />
                <p className="mt-2 text-sm text-zinc-500">
                  Select a conversation to view messages
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

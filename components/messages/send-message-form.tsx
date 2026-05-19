'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { whatsappAPI } from '@/lib/api/whatsapp-api';
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function SendMessageForm() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [eventId, setEventId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
    wamid?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const response = await whatsappAPI.sendMessage({
      to: phone,
      message,
      event_id: eventId || undefined,
    });

    if (response.success && response.data) {
      setResult({
        type: 'success',
        message: 'Message sent successfully!',
        wamid: response.data.wamid,
      });
      setPhone('');
      setMessage('');
      setEventId('');
    } else {
      setResult({
        type: 'error',
        message: response.error || 'Failed to send message',
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Send Message</h2>
        <p className="text-zinc-500">Send WhatsApp messages to your users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="919xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Include country code (e.g., 919xxxxxxxxx for India)
              </p>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
                rows={6}
              />
            </div>

            <div>
              <label
                htmlFor="eventId"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Event ID (Optional)
              </label>
              <Input
                id="eventId"
                type="text"
                placeholder="abc123"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                disabled={loading}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Link this message to a specific event
              </p>
            </div>

            {result && (
              <div
                className={`flex items-start gap-3 rounded-lg border p-4 ${
                  result.type === 'success'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                {result.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      result.type === 'success'
                        ? 'text-green-900'
                        : 'text-red-900'
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.wamid && (
                    <p className="mt-1 text-xs text-green-700">
                      Message ID: {result.wamid}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

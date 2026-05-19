'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Webhook, Database, Bell } from 'lucide-react';

export function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Settings</h2>
        <p className="text-zinc-500">Manage your WhatsApp integration settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Backend API settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-zinc-700">API Base URL</p>
              <p className="text-sm text-zinc-500">
                {process.env.NEXT_PUBLIC_API_BASE || 'https://api.unifesto.app'}
              </p>
            </div>
            <div className="mt-4 rounded-lg bg-zinc-50 p-3">
              <p className="text-xs text-zinc-600">
                All WhatsApp messages are processed through the backend API.
                Frontend never calls Meta API directly.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Webhook className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Webhook Status</CardTitle>
                <CardDescription>Real-time message updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm font-medium text-zinc-700">Active</p>
            </div>
            <p className="text-sm text-zinc-500">
              Webhooks are configured on the backend to receive:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm text-zinc-500">
              <li>Incoming messages</li>
              <li>Delivery status updates</li>
              <li>Read receipts</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Database</CardTitle>
                <CardDescription>Supabase integration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm font-medium text-zinc-700">Connected</p>
            </div>
            <p className="text-sm text-zinc-500">
              Authentication and user management powered by Supabase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Event Notifications</CardTitle>
                <CardDescription>Event-based messaging</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-zinc-500">
              Send automated messages for:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm text-zinc-500">
              <li>Event registration confirmations</li>
              <li>Event reminders</li>
              <li>Event updates and changes</li>
            </ul>
            <p className="mt-3 text-xs text-zinc-600">
              Include event_id when sending messages to link them to events
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium text-zinc-900">Environment Variables</h4>
            <div className="rounded-lg bg-zinc-900 p-4 font-mono text-sm text-zinc-100">
              <div>NEXT_PUBLIC_API_BASE=https://api.unifesto.app</div>
              <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key</div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-zinc-900">Backend Endpoints</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                <code className="rounded bg-zinc-100 px-2 py-1">
                  POST /messages/send
                </code>{' '}
                - Send WhatsApp message
              </li>
              <li>
                <code className="rounded bg-zinc-100 px-2 py-1">
                  GET /messages
                </code>{' '}
                - Fetch message history
              </li>
              <li>
                <code className="rounded bg-zinc-100 px-2 py-1">
                  GET /stats
                </code>{' '}
                - Get message statistics
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

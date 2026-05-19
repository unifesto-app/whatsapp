# API Reference - WhatsApp Manager

Complete API documentation for the WhatsApp Manager frontend.

## Table of Contents
- [API Wrapper](#api-wrapper)
- [Types](#types)
- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)

---

## API Wrapper

### `whatsappAPI`

Location: `lib/api/whatsapp-api.ts`

Main API client for WhatsApp operations.

#### Methods

##### `sendMessage(payload: SendMessagePayload): Promise<ApiResponse<{ wamid: string; status: string }>>`

Send a WhatsApp message.

**Parameters:**
```typescript
interface SendMessagePayload {
  to: string;        // Phone number with country code
  message: string;   // Message content
  event_id?: string; // Optional event ID
}
```

**Returns:**
```typescript
{
  success: boolean;
  data?: {
    wamid: string;   // WhatsApp message ID
    status: string;  // Message status
  };
  error?: string;
}
```

**Example:**
```typescript
const response = await whatsappAPI.sendMessage({
  to: '919876543210',
  message: 'Hello from Unifesto!',
  event_id: 'event_123'
});

if (response.success) {
  console.log('Message sent:', response.data.wamid);
} else {
  console.error('Error:', response.error);
}
```

---

##### `getMessages(limit?: number): Promise<ApiResponse<Message[]>>`

Fetch message history.

**Parameters:**
- `limit` (optional): Number of messages to fetch (default: 50)

**Returns:**
```typescript
{
  success: boolean;
  data?: Message[];
  error?: string;
}
```

**Example:**
```typescript
const response = await whatsappAPI.getMessages(100);

if (response.success) {
  console.log('Messages:', response.data);
}
```

---

##### `getStats(): Promise<ApiResponse<MessageStats>>`

Get message statistics.

**Returns:**
```typescript
{
  success: boolean;
  data?: {
    total_sent: number;
    delivered: number;
    failed: number;
    read: number;
  };
  error?: string;
}
```

**Example:**
```typescript
const response = await whatsappAPI.getStats();

if (response.success) {
  console.log('Total sent:', response.data.total_sent);
}
```

---

##### `getMessagesByPhone(phone: string): Promise<ApiResponse<Message[]>>`

Get messages for a specific phone number.

**Parameters:**
- `phone`: Phone number to filter by

**Returns:**
```typescript
{
  success: boolean;
  data?: Message[];
  error?: string;
}
```

**Example:**
```typescript
const response = await whatsappAPI.getMessagesByPhone('919876543210');
```

---

## Types

### `Message`

```typescript
interface Message {
  id: string;                              // Unique message ID
  from: string;                            // Sender phone number
  to: string;                              // Recipient phone number
  message: string;                         // Message content
  timestamp: string;                       // ISO 8601 timestamp
  status: 'sent' | 'delivered' | 'read' | 'failed';
  direction: 'inbound' | 'outbound';      // Message direction
  wamid?: string;                          // WhatsApp message ID
  event_id?: string;                       // Linked event ID
}
```

### `MessageStats`

```typescript
interface MessageStats {
  total_sent: number;   // Total messages sent
  delivered: number;    // Successfully delivered
  failed: number;       // Failed to deliver
  read: number;         // Read by recipient
}
```

### `MessageGroup`

```typescript
interface MessageGroup {
  phone: string;           // Phone number
  messages: Message[];     // All messages with this phone
  lastMessage: Message;    // Most recent message
  unreadCount: number;     // Unread message count
}
```

### `ApiResponse<T>`

```typescript
interface ApiResponse<T> {
  success: boolean;   // Request success status
  data?: T;          // Response data (if successful)
  error?: string;    // Error message (if failed)
}
```

---

## Components

### UI Components

#### `Button`

Location: `components/ui/button.tsx`

**Props:**
```typescript
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Example:**
```tsx
<Button variant="default" size="lg" onClick={handleClick}>
  Send Message
</Button>
```

---

#### `Card`

Location: `components/ui/card.tsx`

**Components:**
- `Card` - Container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Description text
- `CardContent` - Main content
- `CardFooter` - Footer section

**Example:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

---

#### `Input`

Location: `components/ui/input.tsx`

**Props:**
```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}
```

**Example:**
```tsx
<Input
  type="tel"
  placeholder="919xxxxxxxxx"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
/>
```

---

#### `Textarea`

Location: `components/ui/textarea.tsx`

**Props:**
```typescript
interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}
```

**Example:**
```tsx
<Textarea
  placeholder="Enter your message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows={6}
/>
```

---

### Layout Components

#### `DashboardLayout`

Location: `components/layout/dashboard-layout.tsx`

Main layout wrapper with sidebar and header.

**Props:**
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    email?: string;
  };
}
```

**Example:**
```tsx
<DashboardLayout user={user}>
  <YourContent />
</DashboardLayout>
```

---

#### `Sidebar`

Location: `components/layout/sidebar.tsx`

Navigation sidebar with menu items.

**Navigation Items:**
- Dashboard (`/dashboard`)
- Send Message (`/messages/send`)
- Inbox (`/messages/inbox`)
- Logs (`/messages`)
- Settings (`/settings`)

---

#### `Header`

Location: `components/layout/header.tsx`

Top header with user info and logout.

**Props:**
```typescript
interface HeaderProps {
  user?: {
    email?: string;
  };
}
```

---

### Feature Components

#### `DashboardContent`

Location: `components/dashboard/dashboard-content.tsx`

Dashboard page content with statistics.

**Features:**
- Loads stats from API
- Displays stat cards
- Shows quick action links
- Handles loading and error states

---

#### `SendMessageForm`

Location: `components/messages/send-message-form.tsx`

Form for sending WhatsApp messages.

**Features:**
- Phone number input
- Message textarea
- Optional event ID
- Loading state
- Success/error feedback
- Form validation

---

#### `InboxContent`

Location: `components/messages/inbox-content.tsx`

Chat-style inbox interface.

**Features:**
- Conversation list
- Message thread view
- Status indicators
- Timestamp display
- Auto-grouping by phone

---

#### `LogsContent`

Location: `components/messages/logs-content.tsx`

Message logs table.

**Features:**
- Complete message history
- Status badges
- Direction indicators
- Event ID display
- Sortable columns

---

#### `SettingsContent`

Location: `components/settings/settings-content.tsx`

Settings and configuration display.

**Features:**
- API configuration
- Webhook status
- Database info
- Integration guide

---

## Utilities

### `cn(...inputs: ClassValue[]): string`

Location: `lib/utils/cn.ts`

Utility for merging Tailwind CSS classes.

**Example:**
```typescript
import { cn } from '@/lib/utils/cn';

const className = cn(
  'base-class',
  isActive && 'active-class',
  'another-class'
);
```

---

## Supabase Clients

### Browser Client

Location: `lib/supabase/client.ts`

**Usage:**
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

---

### Server Client

Location: `lib/supabase/server.ts`

**Usage:**
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

---

## Error Handling

All API calls return a consistent response format:

**Success:**
```typescript
{
  success: true,
  data: { /* response data */ }
}
```

**Error:**
```typescript
{
  success: false,
  error: "Error message"
}
```

**Example Usage:**
```typescript
const response = await whatsappAPI.sendMessage(payload);

if (response.success) {
  // Handle success
  console.log(response.data);
} else {
  // Handle error
  console.error(response.error);
}
```

---

## Loading States

All components implement loading states:

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    // API call
  } finally {
    setLoading(false);
  }
};
```

---

## Authentication

### Login

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Logout

```typescript
const supabase = createClient();
await supabase.auth.signOut();
```

### Get Current User

```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

---

## Middleware

Location: `middleware.ts`

Handles authentication and route protection.

**Protected Routes:**
- `/dashboard`
- `/messages/*`
- `/settings`

**Public Routes:**
- `/login`
- `/` (redirects to dashboard)

---

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.unifesto.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Access in code:
```typescript
const apiBase = process.env.NEXT_PUBLIC_API_URL;
```

---

## Best Practices

### 1. Error Handling
Always handle both success and error cases:
```typescript
const response = await whatsappAPI.sendMessage(payload);
if (response.success) {
  // Success
} else {
  // Error
}
```

### 2. Loading States
Show loading indicators during async operations:
```typescript
{loading ? <Loader /> : <Content />}
```

### 3. Phone Number Format
Always use international format:
```typescript
const phone = '919876543210'; // ✅ Correct
const phone = '9876543210';   // ❌ Wrong
```

### 4. Type Safety
Use TypeScript types for all API calls:
```typescript
const payload: SendMessagePayload = {
  to: phone,
  message: text,
  event_id: eventId
};
```

---

## Testing

### Manual Testing

1. **Send Message**
   - Navigate to `/messages/send`
   - Fill form and submit
   - Verify success message

2. **View Inbox**
   - Navigate to `/messages/inbox`
   - Check conversation list
   - Click conversation
   - Verify messages display

3. **Check Logs**
   - Navigate to `/messages`
   - Verify table displays
   - Check status badges

---

## Troubleshooting

### Common Issues

**Issue: API calls fail**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running
- Check network tab in browser

**Issue: Authentication fails**
- Verify Supabase credentials
- Check user exists in Supabase
- Clear cookies and try again

**Issue: Build fails**
- Run `npm install`
- Check TypeScript errors
- Verify all imports are correct

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)

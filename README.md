# WhatsApp Manager - Unifesto

A comprehensive WhatsApp Cloud API management dashboard for Unifesto. This module allows organizers to send messages, view inbox, track delivery status, and manage event-related notifications.

## 🏗️ Architecture

- **Frontend**: Next.js 16 (App Router + TypeScript + Tailwind CSS)
- **Backend**: https://api.unifesto.app (handles all WhatsApp Cloud API calls)
- **Database**: Supabase (authentication and user management)
- **Design**: Clean SaaS-style UI (Stripe/Notion inspired)

## ✨ Features

### 1. Dashboard (`/dashboard`)
- Overview statistics (total sent, delivered, failed, read)
- Quick action cards
- Real-time message metrics

### 2. Send Message (`/messages/send`)
- Clean form interface
- Phone number input with country code
- Message textarea
- Optional event_id linking
- Real-time status feedback
- Success/error handling with wamid display

### 3. Inbox (`/messages/inbox`)
- Chat-style UI
- Messages grouped by phone number
- Inbound and outbound messages
- Delivery status indicators
- Timestamp display
- Conversation view

### 4. Message Logs (`/messages`)
- Complete message history table
- Status badges (sent/delivered/read/failed)
- Direction indicators (inbound/outbound)
- Event ID tracking
- Sortable and filterable

### 5. Settings (`/settings`)
- API configuration display
- Webhook status
- Database connection info
- Event notification settings
- Integration guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Backend API running at https://api.unifesto.app

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd whatsapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://api.unifesto.app

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
whatsapp/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/          # Dashboard page
│   │   ├── messages/
│   │   │   ├── send/          # Send message page
│   │   │   ├── inbox/         # Inbox page
│   │   │   └── page.tsx       # Message logs
│   │   └── settings/          # Settings page
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home (redirects to dashboard)
├── components/
│   ├── dashboard/
│   │   └── dashboard-content.tsx
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── dashboard-layout.tsx
│   ├── messages/
│   │   ├── send-message-form.tsx
│   │   ├── inbox-content.tsx
│   │   └── logs-content.tsx
│   ├── settings/
│   │   └── settings-content.tsx
│   └── ui/                    # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── lib/
│   ├── api/
│   │   └── whatsapp-api.ts    # API wrapper
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   └── server.ts          # Server client
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── utils/
│       └── cn.ts              # Utility functions
├── middleware.ts              # Auth middleware
└── .env.example               # Environment template
```

## 🔌 API Integration

### Backend Endpoints

All WhatsApp operations go through the backend API:

#### Send Message
```typescript
POST https://api.unifesto.app/messages/send
Content-Type: application/json

{
  "to": "919xxxxxxxxx",
  "message": "Hello from Unifesto",
  "event_id": "abc123" // optional
}

Response:
{
  "wamid": "wamid.xxx",
  "status": "sent"
}
```

#### Get Messages
```typescript
GET https://api.unifesto.app/messages?limit=50

Response:
[
  {
    "id": "msg_123",
    "from": "919xxxxxxxxx",
    "to": "919yyyyyyyyy",
    "message": "Hello",
    "timestamp": "2024-01-01T12:00:00Z",
    "status": "delivered",
    "direction": "outbound",
    "wamid": "wamid.xxx",
    "event_id": "abc123"
  }
]
```

#### Get Statistics
```typescript
GET https://api.unifesto.app/stats

Response:
{
  "total_sent": 1250,
  "delivered": 1180,
  "failed": 20,
  "read": 950
}
```

### API Wrapper Usage

```typescript
import { whatsappAPI } from '@/lib/api/whatsapp-api';

// Send a message
const response = await whatsappAPI.sendMessage({
  to: '919xxxxxxxxx',
  message: 'Hello!',
  event_id: 'event_123'
});

// Get messages
const messages = await whatsappAPI.getMessages(50);

// Get stats
const stats = await whatsappAPI.getStats();
```

## 🔐 Authentication

The app uses Supabase for authentication:

- All routes except `/login` are protected
- Middleware handles auth checks and redirects
- User session is maintained across pages
- Logout functionality in header

## 🎨 UI Components

### Reusable Components
- `Button` - Multiple variants (default, outline, ghost, destructive)
- `Card` - Container with header, content, footer
- `Input` - Styled text input
- `Textarea` - Multi-line text input

### Layout Components
- `Sidebar` - Navigation menu
- `Header` - Top bar with user info and logout
- `DashboardLayout` - Main layout wrapper

## 📱 Event-Based Messaging

Messages can be linked to events using the `event_id` field:

```typescript
// Registration confirmation
await whatsappAPI.sendMessage({
  to: userPhone,
  message: 'Your registration for TechFest 2024 is confirmed!',
  event_id: 'techfest_2024'
});

// Event reminder
await whatsappAPI.sendMessage({
  to: userPhone,
  message: 'Reminder: TechFest starts tomorrow at 10 AM',
  event_id: 'techfest_2024'
});
```

## 🔄 Webhook Integration

The backend handles webhooks for:
- Incoming messages
- Delivery status updates
- Read receipts

Frontend automatically displays updated data from the API.

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 📦 Dependencies

### Core
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety

### Supabase
- `@supabase/ssr` - Server-side rendering support
- `@supabase/supabase-js` - Supabase client

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `date-fns` - Date formatting
- `clsx` & `tailwind-merge` - Class name utilities

## 🔒 Security

- Frontend NEVER calls WhatsApp Cloud API directly
- All API calls go through backend
- Supabase handles authentication
- Protected routes via middleware
- Environment variables for sensitive data

## 📝 Environment Variables

Required variables in `.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://api.unifesto.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚨 Error Handling

All API calls include proper error handling:
- Loading states
- Success messages
- Error messages
- Network error handling
- User-friendly error display

## 📊 Message Status Flow

```
sent → delivered → read
  ↓
failed
```

- **sent**: Message sent to WhatsApp
- **delivered**: Message delivered to recipient
- **read**: Recipient read the message
- **failed**: Message failed to send

## 🎯 Best Practices

1. **Always include country code** in phone numbers (e.g., 919xxxxxxxxx)
2. **Use event_id** to track event-related messages
3. **Handle loading states** for better UX
4. **Display error messages** clearly to users
5. **Keep messages concise** for better delivery rates

## 📄 License

Part of the Unifesto platform.

## 🤝 Support

For issues or questions, contact the Unifesto development team.
# whatsapp

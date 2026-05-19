# Architecture Overview - WhatsApp Manager

Visual representation of the system architecture and data flow.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend (Port 3000)               │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │   │
│  │  │Dashboard │  │  Send    │  │  Inbox   │  │  Logs  │ │   │
│  │  │  Page    │  │ Message  │  │   Page   │  │  Page  │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘ │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │         API Wrapper (whatsapp-api.ts)          │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (Authentication)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Auth API   │  │   Database   │  │   Storage    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend API (api.unifesto.app)                      │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ POST /send   │  │ GET /messages│  │  GET /stats  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │POST /webhook │  ◄─────────────────────────────┐            │
│  └──────────────┘                                  │            │
└─────────────────────────────────────────────────────────────────┘
                              │                      │
                              │ HTTPS                │ HTTPS
                              ▼                      │
┌─────────────────────────────────────────────────────────────────┐
│                  WhatsApp Cloud API (Meta)                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Send Message │  │   Webhooks   │  │    Status    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
                        End Users (WhatsApp)
```

---

## 📊 Data Flow Diagrams

### 1. Send Message Flow

```
User
  │
  │ 1. Fill form (phone, message, event_id)
  ▼
Send Message Form
  │
  │ 2. Validate input
  ▼
API Wrapper (whatsappAPI.sendMessage)
  │
  │ 3. POST /messages/send
  │    Body: { to, message, event_id }
  ▼
Backend API
  │
  │ 4. Validate phone number
  │ 5. Call WhatsApp Cloud API
  ▼
WhatsApp Cloud API
  │
  │ 6. Send message to recipient
  │ 7. Return wamid
  ▼
Backend API
  │
  │ 8. Store in database
  │ 9. Return response
  ▼
API Wrapper
  │
  │ 10. Handle response
  ▼
Send Message Form
  │
  │ 11. Display success/error
  ▼
User sees result
```

---

### 2. Inbox Flow

```
User
  │
  │ 1. Navigate to /messages/inbox
  ▼
Inbox Page
  │
  │ 2. Load messages
  ▼
API Wrapper (whatsappAPI.getMessages)
  │
  │ 3. GET /messages?limit=100
  ▼
Backend API
  │
  │ 4. Query database
  │ 5. Return messages
  ▼
API Wrapper
  │
  │ 6. Group by phone number
  │ 7. Sort by timestamp
  ▼
Inbox Content
  │
  │ 8. Display conversation list
  │ 9. Display message thread
  ▼
User views messages
```

---

### 3. Webhook Flow

```
WhatsApp User
  │
  │ 1. Sends message or reads message
  ▼
WhatsApp Cloud API
  │
  │ 2. Trigger webhook
  │    POST /webhook
  ▼
Backend API
  │
  │ 3. Verify signature
  │ 4. Parse payload
  │ 5. Update database
  ▼
Database
  │
  │ Message status updated
  ▼
Frontend (on next poll)
  │
  │ 6. GET /messages
  │ 7. Fetch updated data
  ▼
UI Updates
  │
  │ 8. Display new status
  ▼
User sees update
```

---

### 4. Authentication Flow

```
User
  │
  │ 1. Visit protected route
  ▼
Middleware
  │
  │ 2. Check session
  │
  ├─ No session ──────────┐
  │                        │
  │ 3. Redirect to /login  │
  ▼                        │
Login Page                 │
  │                        │
  │ 4. Enter credentials   │
  ▼                        │
Supabase Auth              │
  │                        │
  │ 5. Validate            │
  │ 6. Create session      │
  ▼                        │
Middleware                 │
  │                        │
  │ 7. Session exists ◄────┘
  ▼
Protected Page
  │
  │ 8. Render content
  ▼
User sees dashboard
```

---

## 🗂️ Component Hierarchy

```
App
│
├── Layout (Root)
│   ├── Metadata
│   └── Body
│
├── Login Page
│   ├── Card
│   ├── Input (email)
│   ├── Input (password)
│   └── Button (submit)
│
└── Dashboard Layout
    │
    ├── Sidebar
    │   ├── Logo
    │   ├── Navigation Links
    │   │   ├── Dashboard
    │   │   ├── Send Message
    │   │   ├── Inbox
    │   │   ├── Logs
    │   │   └── Settings
    │   └── Version Info
    │
    ├── Header
    │   ├── Title
    │   ├── User Info
    │   └── Logout Button
    │
    └── Main Content
        │
        ├── Dashboard Page
        │   ├── Stats Cards
        │   │   ├── Total Sent
        │   │   ├── Delivered
        │   │   ├── Failed
        │   │   └── Read
        │   └── Quick Actions
        │
        ├── Send Message Page
        │   └── Send Message Form
        │       ├── Phone Input
        │       ├── Message Textarea
        │       ├── Event ID Input
        │       ├── Submit Button
        │       └── Result Display
        │
        ├── Inbox Page
        │   └── Inbox Content
        │       ├── Conversation List
        │       │   └── Conversation Items
        │       └── Message Thread
        │           └── Message Bubbles
        │
        ├── Logs Page
        │   └── Logs Content
        │       └── Message Table
        │           ├── Table Header
        │           └── Table Rows
        │
        └── Settings Page
            └── Settings Content
                ├── API Config Card
                ├── Webhook Card
                ├── Database Card
                ├── Events Card
                └── Integration Guide
```

---

## 🔄 State Management

### Client-Side State

```
Component State (useState)
│
├── Dashboard
│   ├── stats: MessageStats | null
│   ├── loading: boolean
│   └── error: string | null
│
├── Send Message
│   ├── phone: string
│   ├── message: string
│   ├── eventId: string
│   ├── loading: boolean
│   └── result: { type, message, wamid? } | null
│
├── Inbox
│   ├── groups: MessageGroup[]
│   ├── selectedPhone: string | null
│   ├── loading: boolean
│   └── error: string | null
│
└── Logs
    ├── messages: Message[]
    ├── loading: boolean
    └── error: string | null
```

### Server-Side State

```
Supabase Session
│
├── user: User | null
├── access_token: string
├── refresh_token: string
└── expires_at: number
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Layer 1: Middleware             │
│  - Check authentication                 │
│  - Redirect if not logged in            │
│  - Verify session validity              │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Layer 2: Page Protection           │
│  - Server-side user check               │
│  - Redirect if no user                  │
│  - Pass user to components              │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Layer 3: API Wrapper               │
│  - Add auth headers                     │
│  - Handle errors                        │
│  - Validate responses                   │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Layer 4: Backend API               │
│  - Verify JWT tokens                    │
│  - Validate input                       │
│  - Rate limiting                        │
│  - Sanitize data                        │
└─────────────────────────────────────────┘
```

---

## 📦 Module Dependencies

```
App Pages
  │
  ├─► Layout Components
  │     ├─► UI Components
  │     └─► Icons (Lucide)
  │
  ├─► Feature Components
  │     ├─► UI Components
  │     ├─► API Wrapper
  │     └─► Types
  │
  ├─► API Wrapper
  │     ├─► Types
  │     └─► Environment Config
  │
  ├─► Supabase Clients
  │     └─► Environment Config
  │
  └─► Middleware
        └─► Supabase Client
```

---

## 🌐 Network Flow

### Request Flow

```
Browser
  │
  │ 1. User action
  ▼
React Component
  │
  │ 2. Call API wrapper
  ▼
API Wrapper (lib/api/whatsapp-api.ts)
  │
  │ 3. Construct request
  │    - Add headers
  │    - Serialize body
  ▼
Fetch API
  │
  │ 4. HTTPS request
  ▼
Backend API (api.unifesto.app)
  │
  │ 5. Process request
  │    - Validate
  │    - Call WhatsApp API
  │    - Store in DB
  ▼
Response
  │
  │ 6. JSON response
  ▼
API Wrapper
  │
  │ 7. Parse response
  │    - Check success
  │    - Extract data
  ▼
React Component
  │
  │ 8. Update state
  │    - Set data
  │    - Clear loading
  ▼
UI Update
  │
  │ 9. Re-render
  ▼
User sees result
```

---

## 💾 Data Models

### Frontend Types

```typescript
// Message
interface Message {
  id: string
  from: string
  to: string
  message: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  direction: 'inbound' | 'outbound'
  wamid?: string
  event_id?: string
}

// Message Stats
interface MessageStats {
  total_sent: number
  delivered: number
  failed: number
  read: number
}

// Message Group
interface MessageGroup {
  phone: string
  messages: Message[]
  lastMessage: Message
  unreadCount: number
}

// API Response
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

---

## 🔄 Lifecycle Flows

### Component Lifecycle

```
Mount
  │
  │ 1. useEffect runs
  ▼
Load Data
  │
  │ 2. Set loading = true
  │ 3. Call API
  ▼
API Response
  │
  │ 4. Set data
  │ 5. Set loading = false
  ▼
Render
  │
  │ 6. Display data
  ▼
User Interaction
  │
  │ 7. Update state
  ▼
Re-render
  │
  │ 8. Display updated UI
  ▼
Unmount
  │
  │ 9. Cleanup
  ▼
End
```

---

## 🎯 Request/Response Patterns

### Standard Pattern

```
Request:
  Method: POST/GET
  Headers:
    Content-Type: application/json
  Body: JSON payload

Response (Success):
  Status: 200
  Body: {
    success: true,
    data: { ... }
  }

Response (Error):
  Status: 400/500
  Body: {
    success: false,
    error: "Error message"
  }
```

---

## 📱 Responsive Design Breakpoints

```
Mobile (< 768px)
  │
  ├─ Single column layout
  ├─ Stacked navigation
  ├─ Full-width cards
  └─ Simplified tables

Tablet (768px - 1024px)
  │
  ├─ Two column layout
  ├─ Sidebar visible
  ├─ Grid cards
  └─ Responsive tables

Desktop (> 1024px)
  │
  ├─ Full layout
  ├─ Sidebar + content
  ├─ Multi-column grids
  └─ Full tables
```

---

## 🚀 Build & Deploy Flow

```
Development
  │
  │ npm run dev
  ▼
Next.js Dev Server
  │
  │ Hot reload
  │ Fast refresh
  ▼
Local Testing
  │
  │ npm run build
  ▼
Production Build
  │
  │ Optimize
  │ Bundle
  │ Generate static
  ▼
Build Output (.next/)
  │
  │ Deploy
  ▼
Production Server
  │
  │ npm start
  ▼
Live Application
```

---

## 🎨 Styling Architecture

```
Tailwind CSS
  │
  ├─ Global Styles (globals.css)
  │   ├─ Base styles
  │   ├─ Component styles
  │   └─ Utility classes
  │
  ├─ Component Styles
  │   ├─ Inline classes
  │   ├─ Conditional classes
  │   └─ cn() utility
  │
  └─ Theme Configuration
      ├─ Colors
      ├─ Spacing
      ├─ Typography
      └─ Breakpoints
```

---

## 📊 Performance Optimization

```
Next.js Optimizations
  │
  ├─ Automatic Code Splitting
  ├─ Image Optimization
  ├─ Font Optimization
  ├─ Static Generation
  └─ Server Components

Custom Optimizations
  │
  ├─ Lazy Loading
  ├─ Memoization
  ├─ Debouncing
  └─ Caching
```

---

This architecture provides a clear, scalable foundation for the WhatsApp Manager application with proper separation of concerns, security layers, and data flow patterns.

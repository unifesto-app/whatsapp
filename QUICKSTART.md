# Quick Start Guide - WhatsApp Manager

Get up and running with the WhatsApp Manager in 5 minutes.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://api.unifesto.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📋 Backend Checklist

Ensure your backend implements these endpoints:

- [ ] `POST /messages/send` - Send WhatsApp message
- [ ] `GET /messages` - Fetch message history
- [ ] `GET /stats` - Get message statistics
- [ ] `POST /webhook` - Handle WhatsApp webhooks

See [INTEGRATION.md](./INTEGRATION.md) for detailed API specs.

---

## 🎯 Quick Test

### Test Send Message

1. Login to the app
2. Navigate to "Send Message"
3. Enter phone number: `919xxxxxxxxx`
4. Enter message: `Hello from Unifesto!`
5. Click "Send Message"
6. Check for success message with wamid

### Test Inbox

1. Navigate to "Inbox"
2. View conversations grouped by phone
3. Click on a conversation
4. See message history with status

### Test Logs

1. Navigate to "Logs"
2. View all messages in table format
3. Check status badges
4. Verify timestamps

---

## 🔧 Common Issues

### Issue: "Missing Supabase environment variables"
**Solution**: Check `.env.local` file has correct Supabase credentials

### Issue: "Failed to send message"
**Solution**: Verify backend API is running and accessible

### Issue: "Unauthorized"
**Solution**: Login with valid Supabase credentials

### Issue: "Network error"
**Solution**: Check `NEXT_PUBLIC_API_URL` points to correct backend URL

---

## 📱 Phone Number Format

Always use international format with country code:
- ✅ Correct: `919876543210` (India)
- ✅ Correct: `14155552671` (USA)
- ❌ Wrong: `9876543210` (missing country code)
- ❌ Wrong: `+919876543210` (don't include +)

---

## 🎨 UI Overview

### Dashboard
- View message statistics
- Quick action cards
- Real-time metrics

### Send Message
- Phone number input
- Message textarea
- Optional event_id
- Success/error feedback

### Inbox
- Conversation list (left)
- Message thread (right)
- Status indicators
- Timestamps

### Logs
- Complete message table
- Status badges
- Direction indicators
- Event ID tracking

### Settings
- API configuration
- Webhook status
- Integration guide

---

## 🔐 Authentication Flow

1. User visits any protected route
2. Middleware checks Supabase session
3. If not authenticated → redirect to `/login`
4. User logs in with email/password
5. Supabase creates session
6. User redirected to `/dashboard`

---

## 📊 Message Status Flow

```
User sends message
    ↓
Status: "sent"
    ↓
WhatsApp delivers
    ↓
Status: "delivered"
    ↓
User reads message
    ↓
Status: "read"
```

If any step fails → Status: "failed"

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 📦 Project Structure

```
whatsapp/
├── app/                    # Next.js pages
│   ├── (dashboard)/       # Protected routes
│   ├── login/            # Login page
│   └── page.tsx          # Home (redirects)
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── messages/         # Message components
│   ├── settings/         # Settings components
│   └── ui/               # Reusable UI
├── lib/                   # Utilities
│   ├── api/              # API wrapper
│   ├── supabase/         # Supabase clients
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
└── middleware.ts          # Auth middleware
```

---

## 🎯 Next Steps

1. **Customize Branding**
   - Update colors in Tailwind config
   - Change logo in sidebar
   - Modify metadata in layout

2. **Add Features**
   - Message templates
   - Bulk messaging
   - Scheduled messages
   - Analytics dashboard

3. **Integrate with Events**
   - Link messages to events
   - Auto-send confirmations
   - Event reminders
   - Update notifications

4. **Enhance UI**
   - Add filters to logs
   - Search functionality
   - Export to CSV
   - Dark mode

---

## 📚 Documentation

- [README.md](./README.md) - Complete documentation
- [INTEGRATION.md](./INTEGRATION.md) - Backend integration guide
- [.env.example](./.env.example) - Environment variables template

---

## 🆘 Need Help?

1. Check [README.md](./README.md) for detailed docs
2. Review [INTEGRATION.md](./INTEGRATION.md) for API specs
3. Verify environment variables
4. Check browser console for errors
5. Check backend logs

---

## ✅ Production Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Backend API tested
- [ ] Supabase authentication working
- [ ] All routes accessible
- [ ] Error handling tested
- [ ] Loading states working
- [ ] Mobile responsive
- [ ] Build succeeds (`npm run build`)
- [ ] Production server starts (`npm start`)

---

## 🎉 You're Ready!

Your WhatsApp Manager is now set up and ready to use. Start sending messages and managing your WhatsApp communications!

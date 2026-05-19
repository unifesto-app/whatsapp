# WhatsApp Manager Integration Guide

## Backend Requirements

The backend API must implement the following endpoints:

### 1. Send Message Endpoint

**Endpoint**: `POST /messages/send`

**Request Body**:
```json
{
  "to": "919xxxxxxxxx",
  "message": "Your message text here",
  "event_id": "optional_event_id"
}
```

**Response** (Success - 200):
```json
{
  "wamid": "wamid.HBgNOTE5MTIzNDU2Nzg5FQIAERgSMzQ1Njc4OTAxMjM0NTY3ODkA",
  "status": "sent"
}
```

**Response** (Error - 400/500):
```json
{
  "error": "Error message description",
  "message": "User-friendly error message"
}
```

**Implementation Notes**:
- Validate phone number format
- Call WhatsApp Cloud API
- Store message in database
- Return WhatsApp message ID (wamid)

---

### 2. Get Messages Endpoint

**Endpoint**: `GET /messages?limit=50&phone=919xxxxxxxxx`

**Query Parameters**:
- `limit` (optional): Number of messages to return (default: 50)
- `phone` (optional): Filter by specific phone number

**Response** (Success - 200):
```json
[
  {
    "id": "msg_unique_id",
    "from": "919xxxxxxxxx",
    "to": "919yyyyyyyyy",
    "message": "Message content",
    "timestamp": "2024-01-15T10:30:00Z",
    "status": "delivered",
    "direction": "outbound",
    "wamid": "wamid.xxx",
    "event_id": "event_123"
  }
]
```

**Field Descriptions**:
- `id`: Unique message identifier
- `from`: Sender phone number
- `to`: Recipient phone number
- `message`: Message content
- `timestamp`: ISO 8601 timestamp
- `status`: One of: `sent`, `delivered`, `read`, `failed`
- `direction`: One of: `inbound`, `outbound`
- `wamid`: WhatsApp message ID (optional)
- `event_id`: Linked event ID (optional)

---

### 3. Get Statistics Endpoint

**Endpoint**: `GET /stats`

**Response** (Success - 200):
```json
{
  "total_sent": 1250,
  "delivered": 1180,
  "failed": 20,
  "read": 950
}
```

**Implementation Notes**:
- Count messages by status
- Only count outbound messages
- Cache results for performance

---

## Webhook Configuration

The backend should handle WhatsApp webhooks for real-time updates:

### Webhook URL
```
POST https://api.unifesto.app/webhook
```

### Webhook Events

#### 1. Incoming Message
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "919xxxxxxxxx",
          "id": "wamid.xxx",
          "timestamp": "1234567890",
          "text": {
            "body": "Message content"
          },
          "type": "text"
        }]
      }
    }]
  }]
}
```

**Action**: Store incoming message in database with `direction: "inbound"`

#### 2. Status Update
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "statuses": [{
          "id": "wamid.xxx",
          "status": "delivered",
          "timestamp": "1234567890",
          "recipient_id": "919xxxxxxxxx"
        }]
      }
    }]
  }]
}
```

**Action**: Update message status in database

---

## Database Schema

Suggested database schema for messages:

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_phone VARCHAR(20) NOT NULL,
  to_phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'sent',
  direction VARCHAR(10) NOT NULL,
  wamid VARCHAR(255),
  event_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_from ON messages(from_phone);
CREATE INDEX idx_messages_to ON messages(to_phone);
CREATE INDEX idx_messages_event ON messages(event_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

---

## WhatsApp Cloud API Integration

### Prerequisites
1. Meta Business Account
2. WhatsApp Business App
3. Phone Number ID
4. Access Token

### Send Message API Call

```typescript
const response = await fetch(
  `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        body: message
      }
    })
  }
);
```

### Response
```json
{
  "messaging_product": "whatsapp",
  "contacts": [{
    "input": "919xxxxxxxxx",
    "wa_id": "919xxxxxxxxx"
  }],
  "messages": [{
    "id": "wamid.HBgNOTE5MTIzNDU2Nzg5FQIAERgSMzQ1Njc4OTAxMjM0NTY3ODkA"
  }]
}
```

---

## Error Handling

### Common Errors

#### 1. Invalid Phone Number
```json
{
  "error": {
    "message": "Invalid phone number",
    "code": 400
  }
}
```

#### 2. Rate Limit Exceeded
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "code": 429
  }
}
```

#### 3. Invalid Access Token
```json
{
  "error": {
    "message": "Invalid OAuth access token",
    "code": 190
  }
}
```

### Backend Error Responses

Always return consistent error format:
```json
{
  "error": "Technical error description",
  "message": "User-friendly message"
}
```

---

## Security Considerations

### 1. Authentication
- Verify Supabase JWT tokens
- Check user permissions
- Rate limit per user

### 2. Phone Number Validation
```typescript
function validatePhoneNumber(phone: string): boolean {
  // Must start with country code
  // Must be 10-15 digits
  const regex = /^\d{10,15}$/;
  return regex.test(phone);
}
```

### 3. Message Content
- Sanitize input
- Check for spam patterns
- Limit message length (4096 chars for WhatsApp)

### 4. Webhook Verification
```typescript
function verifyWebhook(signature: string, body: string): boolean {
  const hash = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  return signature === hash;
}
```

---

## Environment Variables (Backend)

```env
# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=your_database_url

# Supabase (for auth verification)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Testing

### Test Send Message
```bash
curl -X POST https://api.unifesto.app/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "to": "919xxxxxxxxx",
    "message": "Test message",
    "event_id": "test_event"
  }'
```

### Test Get Messages
```bash
curl -X GET "https://api.unifesto.app/messages?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Get Stats
```bash
curl -X GET https://api.unifesto.app/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Rate Limits

WhatsApp Cloud API rate limits:
- **Tier 1**: 1,000 messages per day
- **Tier 2**: 10,000 messages per day
- **Tier 3**: 100,000 messages per day
- **Tier 4**: Unlimited

Implement rate limiting in backend:
```typescript
const rateLimit = {
  windowMs: 60 * 1000, // 1 minute
  max: 100 // 100 requests per minute
};
```

---

## Monitoring

### Metrics to Track
1. Messages sent per day
2. Delivery rate
3. Failure rate
4. Average response time
5. Webhook processing time

### Logging
Log all API calls:
```typescript
{
  timestamp: "2024-01-15T10:30:00Z",
  endpoint: "/messages/send",
  user_id: "user_123",
  phone: "919xxxxxxxxx",
  status: "success",
  wamid: "wamid.xxx",
  duration_ms: 250
}
```

---

## Deployment Checklist

- [ ] WhatsApp Business Account verified
- [ ] Phone number registered
- [ ] Access token configured
- [ ] Webhook URL configured
- [ ] Database schema created
- [ ] Environment variables set
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Logging configured
- [ ] Monitoring setup

---

## Support Resources

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Business Help Center](https://business.facebook.com/help)
- [Supabase Documentation](https://supabase.com/docs)

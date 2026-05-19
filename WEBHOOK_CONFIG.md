# WhatsApp Webhook Configuration

## 📋 Quick Reference

### **Webhook Configuration for Meta Dashboard**

#### **Callback URL**
```
https://api.unifesto.app/messages/webhook
```

#### **Verify Token**
```
un!feSt0@Meta2212
```

#### **Subscribe to Fields**
- ✅ messages
- ✅ message_status

---

## 🔧 Step-by-Step Setup

### **1. Open Meta for Developers**
Go to: https://developers.facebook.com/

### **2. Select Your App**
Navigate to your WhatsApp Business app

### **3. Go to WhatsApp Configuration**
Click: **WhatsApp** → **Configuration** in the left sidebar

### **4. Find Webhooks Section**
Scroll to the "Webhooks" section

### **5. Click "Edit"**
Click the "Edit" button next to Callback URL

### **6. Enter Configuration**

**Callback URL:**
```
https://api.unifesto.app/messages/webhook
```

**Verify Token:**
```
un!feSt0@Meta2212
```

### **7. Click "Verify and Save"**
Meta will verify your webhook endpoint

### **8. Subscribe to Webhook Fields**
Check these boxes:
- ✅ **messages** - Receive incoming messages
- ✅ **message_status** - Receive delivery status updates

### **9. Save Changes**
Click "Save" or "Update"

---

## ✅ Verification

### **Success Indicators:**
- ✅ Green checkmark next to webhook URL
- ✅ Status shows "Verified"
- ✅ Subscribed fields are checked

### **Test the Webhook:**
1. Click "Test" button in Meta dashboard
2. Select "messages" event
3. Click "Send Test"
4. Check backend logs for webhook received

---

## 🎯 What Happens Next

### **When Someone Sends a Message:**
1. User sends WhatsApp message to your business number
2. Meta sends webhook to: `https://api.unifesto.app/messages/webhook`
3. Backend receives and stores message
4. Message appears in WhatsApp Manager inbox

### **When Message Status Changes:**
1. Message is sent/delivered/read
2. Meta sends status update webhook
3. Backend updates message status in database
4. Status updates in WhatsApp Manager

---

## 📝 Important Notes

- ✅ Backend must be running and accessible
- ✅ HTTPS is required (HTTP won't work)
- ✅ Verify token must match exactly
- ✅ App must be published for production data
- ✅ Test mode works for testing

---

## 🐛 If Verification Fails

1. **Check backend is running:**
   ```bash
   curl https://api.unifesto.app/messages/webhook
   ```

2. **Test verification manually:**
   ```bash
   curl "https://api.unifesto.app/messages/webhook?hub.mode=subscribe&hub.verify_token=un!feSt0@Meta2212&hub.challenge=test"
   ```

3. **Check backend logs** for errors

4. **Verify environment variables** are set correctly

---

## ✅ Configuration Complete!

Once verified, your WhatsApp Manager will:
- ✅ Receive all incoming messages
- ✅ Track message delivery status
- ✅ Update status in real-time
- ✅ Store everything in database

**You're all set!** 🎉

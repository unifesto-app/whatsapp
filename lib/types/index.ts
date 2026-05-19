export interface User {
  id: string;
  email: string;
  role?: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  direction: 'inbound' | 'outbound';
  wamid?: string;
  event_id?: string;
}

export interface MessageGroup {
  phone: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

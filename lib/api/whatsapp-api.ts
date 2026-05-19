import { createClient } from '@/lib/supabase/client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.unifesto.app';

export interface SendMessagePayload {
  to: string;
  message: string;
  event_id?: string;
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

export interface MessageStats {
  total_sent: number;
  delivered: number;
  failed: number;
  read: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class WhatsAppAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async sendMessage(payload: SendMessagePayload) {
    return this.request<{ wamid: string; status: string }>('/messages/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMessages(limit: number = 50) {
    return this.request<Message[]>(`/messages?limit=${limit}`, {
      method: 'GET',
    });
  }

  async getStats() {
    return this.request<MessageStats>('/stats', {
      method: 'GET',
    });
  }

  async getMessagesByPhone(phone: string) {
    return this.request<Message[]>(`/messages?phone=${phone}`, {
      method: 'GET',
    });
  }
}

export const whatsappAPI = new WhatsAppAPI();

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SendMessageForm } from '@/components/messages/send-message-form';
import { checkSuperAdmin } from '@/lib/auth/check-role';

export default async function SendMessagePage() {
  const { user } = await checkSuperAdmin();

  return (
    <DashboardLayout user={user}>
      <SendMessageForm />
    </DashboardLayout>
  );
}

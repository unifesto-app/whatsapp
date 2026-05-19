import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LogsContent } from '@/components/messages/logs-content';
import { checkSuperAdmin } from '@/lib/auth/check-role';

export default async function MessagesPage() {
  const { user } = await checkSuperAdmin();

  return (
    <DashboardLayout user={user}>
      <LogsContent />
    </DashboardLayout>
  );
}

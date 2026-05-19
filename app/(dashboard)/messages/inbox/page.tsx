import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InboxContent } from '@/components/messages/inbox-content';
import { checkSuperAdmin } from '@/lib/auth/check-role';

export default async function InboxPage() {
  const { user } = await checkSuperAdmin();

  return (
    <DashboardLayout user={user}>
      <InboxContent />
    </DashboardLayout>
  );
}

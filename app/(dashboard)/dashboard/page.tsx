import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { checkSuperAdmin } from '@/lib/auth/check-role';

export default async function DashboardPage() {
  const { user } = await checkSuperAdmin();

  return (
    <DashboardLayout user={user}>
      <DashboardContent />
    </DashboardLayout>
  );
}

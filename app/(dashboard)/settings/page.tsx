import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SettingsContent } from '@/components/settings/settings-content';
import { checkSuperAdmin } from '@/lib/auth/check-role';

export default async function SettingsPage() {
  const { user } = await checkSuperAdmin();

  return (
    <DashboardLayout user={user}>
      <SettingsContent />
    </DashboardLayout>
  );
}

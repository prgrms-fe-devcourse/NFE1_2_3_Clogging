import FormBlog from '@/features/Admin/Blog-settings/ui/Form';
import SettingsDisplay from '@/features/Admin/Blog-settings/ui/SettingsDisplay';
import SettingsForm from '@/features/Admin/Blog-settings/ui/SettingsForm';

export default function settingPage() {
  return (
    <div>
      <SettingsForm />
      <SettingsDisplay />
    </div>
  );
}

import { User, Settings } from 'lucide-react';
import SidebarSection from './SidebarSection';
import NavItem from './NavItem';

export default function SettingsNav() {
  return (
    <SidebarSection>
      <NavItem to="/profile"  icon={User}     label="Profile"  />
      <NavItem to="/settings" icon={Settings} label="Settings" />
    </SidebarSection>
  );
}

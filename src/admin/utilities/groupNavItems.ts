import {
  EditOutlined,
  LogoutOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Group } from '../components/elements/NavGroup/types.js';
import { useAuth } from '../components/utilities/Auth/index.js';

// /////////////////////////////////////
// Portal
// /////////////////////////////////////

export const profileNavItems = (): Group => {
  const path = '/admin';

  return {
    label: 'profile',
    items: [
      {
        label: 'profile',
        href: `${path}/me`,
        icon: UserOutlined,
      },
      {
        label: 'logout',
        href: `${path}/auth/logout`,
        icon: LogoutOutlined,
      },
    ],
  };
};

// /////////////////////////////////////
// Tenant
// /////////////////////////////////////

export const postNavItems = (): Group => {
  const path = '/admin';

  return {
    label: 'posts',
    items: [
      {
        label: 'posts',
        href: `${path}/posts`,
        icon: EditOutlined,
      },
    ],
  };
};

export const settingsGroupNavItems = (): Group => {
  const { hasPermission } = useAuth();
  const path = '/admin/settings';

  const items = [];

  if (hasPermission('readProject')) {
    items.push({
      label: 'project_setting',
      href: `${path}/project`,
      icon: SettingOutlined,
    });
  }

  if (hasPermission('readRole')) {
    items.push({
      label: 'role',
      href: `${path}/roles`,
      icon: SafetyOutlined,
    });
  }

  if (hasPermission('readUser')) {
    items.push({
      label: 'user',
      href: `${path}/users`,
      icon: TeamOutlined,
    });
  }

  return {
    label: 'setting',
    items,
  };
};

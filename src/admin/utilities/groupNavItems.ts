import {
  EditOutlined,
  LogoutOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Group } from '../components/elements/NavGroup/types.js';

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
  const path = '/admin/settings';

  return {
    label: 'setting',
    items: [
      {
        label: 'project_setting',
        href: `${path}/project`,
        icon: SettingOutlined,
      },
      {
        label: 'role',
        href: `${path}/roles`,
        icon: SafetyOutlined,
      },
      {
        label: 'user',
        href: `${path}/users`,
        icon: TeamOutlined,
      },
    ],
  };
};

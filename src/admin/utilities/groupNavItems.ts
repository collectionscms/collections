import {
  InsertRowAboveOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Model } from '../config/types.js';
import { Group } from '../components/elements/NavGroup/types.js';

export const modelsGroupNavItems = (models: Model[]): Group => {
  return {
    label: 'content_management',
    items: models.map((meta) => ({
      label: `${meta.model}`,
      href: `/admin/models/${meta.id}/contents`,
      icon: UnorderedListOutlined,
    })),
  };
};

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

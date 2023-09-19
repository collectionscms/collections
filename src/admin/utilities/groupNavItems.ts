import {
  InsertRowAboveOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Collection } from '../config/types.js';
import { Group } from '../components/elements/NavGroup/types.js';

export const collectionsGroupNavItems = (collections: Collection[]): Group => {
  return {
    label: 'content_management',
    items: collections.map((meta) => ({
      label: `${meta.collection}`,
      href: `/admin/collections/${meta.id}`,
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
        label: 'content_type',
        href: `${path}/content-types`,
        icon: InsertRowAboveOutlined,
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

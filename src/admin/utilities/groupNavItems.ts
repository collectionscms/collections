import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  KeyOutlined,
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
  const { hasPermission } = useAuth();
  const path = '/admin';

  const items = [];

  if (hasPermission('readOwnPost') || hasPermission('readAllPost')) {
    items.push({
      label: 'posts',
      href: `${path}/posts`,
      icon: EditOutlined,
    });
  }

  if (hasPermission('readOwnReview') || hasPermission('readAllReview')) {
    items.push({
      label: 'review',
      href: `${path}/reviews`,
      icon: InboxOutlined,
    });
  }

  if (hasPermission('trashPost')) {
    items.push({
      label: 'trash',
      href: `${path}/trashed`,
      icon: DeleteOutlined,
    });
  }

  return {
    label: 'posts',
    items,
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

  if (hasPermission('readApiKey')) {
    items.push({
      label: 'api_key',
      href: `${path}/api-keys`,
      icon: KeyOutlined,
    });
  }

  return {
    label: 'setting',
    items,
  };
};

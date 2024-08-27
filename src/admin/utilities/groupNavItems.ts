import { Group, GroupItem } from '../components/elements/NavGroup/types.js';
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
        icon: 'UserRound',
      },
      {
        label: 'logout',
        href: `${path}/auth/logout`,
        icon: 'LogOut',
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

  const items: GroupItem[] = [];

  if (hasPermission('readOwnPost') || hasPermission('readAllPost')) {
    items.push({
      label: 'posts',
      href: `${path}/posts`,
      icon: 'PencilLine',
    });
  }

  if (hasPermission('readOwnReview') || hasPermission('readAllReview')) {
    items.push({
      label: 'review',
      href: `${path}/reviews`,
      icon: 'Inbox',
    });
  }

  if (hasPermission('trashPost')) {
    items.push({
      label: 'trash',
      href: `${path}/trashed`,
      icon: 'Trash2',
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

  const items: GroupItem[] = [];

  if (hasPermission('readProject')) {
    items.push({
      label: 'project_setting',
      href: `${path}/project`,
      icon: 'Settings',
    });
  }

  if (hasPermission('readRole')) {
    items.push({
      label: 'role',
      href: `${path}/roles`,
      icon: 'ShieldCheck',
    });
  }

  if (hasPermission('readUser')) {
    items.push({
      label: 'user',
      href: `${path}/users`,
      icon: 'UsersRound',
    });
  }

  if (hasPermission('readApiKey')) {
    items.push({
      label: 'api_key',
      href: `${path}/api-keys`,
      icon: 'KeyRound',
    });
  }

  return {
    label: 'setting',
    items,
  };
};

export const extensionsGroupNavItems = (): Group => {
  const { hasPermission } = useAuth();
  const path = '/admin';

  const items: GroupItem[] = [];

  if (hasPermission('readTemplate')) {
    items.push({
      label: 'template',
      href: `${path}/templates`,
      icon: 'Blocks',
    });
  }

  return {
    label: 'extension',
    items,
  };
};

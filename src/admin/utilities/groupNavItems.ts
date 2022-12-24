import { faList, faShieldHalved, faTable, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { Group } from 'config/types';

export const collectionsGroupNavItems = (
  collections: Record<keyof { collection: string }, unknown>[]
): Group => {
  return {
    id: 'group-collections',
    label: 'Content Management',
    items: collections.map((meta) => ({
      id: `${meta.collection}`,
      label: `${meta.collection}`,
      href: `/admin/collections/${meta.collection}`,
      icon: faList,
    })),
  };
};

export const settingsGroupNavItems = (): Group => {
  const path = '/admin/settings';

  return {
    id: 'group-settings',
    label: 'Settings',
    items: [
      {
        id: 'content-types',
        label: 'Content Types',
        href: `${path}/content-types`,
        icon: faTable,
      },
      {
        id: 'users',
        label: 'Users',
        href: `${path}/users`,
        icon: faUserGroup,
      },
      {
        id: 'roles',
        label: 'Roles',
        href: `${path}/roles`,
        icon: faShieldHalved,
      },
    ],
  };
};

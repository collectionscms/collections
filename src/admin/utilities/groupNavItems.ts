import { Group } from '@admin/components/elements/NavItem/types';
import {
  faEarthAmerica,
  faList,
  faShieldHalved,
  faTable,
  faUser,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { Collection } from '@shared/types';

export const collectionsGroupNavItems = (collections: Collection[]): Group => {
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

export const profileNavItems = (): Group => {
  const path = '/admin';

  return {
    id: 'group-profiles',
    label: 'Profile',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        href: `${path}/me`,
        icon: faUser,
      },
    ],
  };
};

export const settingsGroupNavItems = (): Group => {
  const path = '/admin/settings';

  return {
    id: 'group-settings',
    label: 'Settings',
    items: [
      {
        id: 'project',
        label: 'Project',
        href: `${path}/project`,
        icon: faEarthAmerica,
      },
      {
        id: 'content-types',
        label: 'Content Types',
        href: `${path}/content-types`,
        icon: faTable,
      },
      {
        id: 'roles',
        label: 'Roles',
        href: `${path}/roles`,
        icon: faShieldHalved,
      },
      {
        id: 'users',
        label: 'Users',
        href: `${path}/users`,
        icon: faUserGroup,
      },
    ],
  };
};

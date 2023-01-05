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
        label: 'project_settings',
        href: `${path}/project`,
        icon: faEarthAmerica,
      },
      {
        id: 'content-types',
        label: 'content_types',
        href: `${path}/content-types`,
        icon: faTable,
      },
      {
        id: 'roles',
        label: 'roles',
        href: `${path}/roles`,
        icon: faShieldHalved,
      },
      {
        id: 'users',
        label: 'users',
        href: `${path}/users`,
        icon: faUserGroup,
      },
    ],
  };
};

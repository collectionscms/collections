import { Group } from '@admin/components/elements/NavItem/types';
import { Type } from '@admin/components/elements/Table/Cell/types';
import {
  faList,
  faShieldHalved,
  faTable,
  faUserGroup,
  faEarthAmerica,
  faUser,
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
      fields: [{ field: 'createdAt', label: 'Created At', type: Type.Date }],
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
        fields: [],
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
        fields: [{ field: 'name', label: 'Project Name', type: Type.Text }],
      },
      {
        id: 'content-types',
        label: 'Content Types',
        href: `${path}/content-types`,
        icon: faTable,
        fields: [{ field: 'name', label: 'Name', type: Type.Text }],
      },
      {
        id: 'roles',
        label: 'Roles',
        href: `${path}/roles`,
        icon: faShieldHalved,
        fields: [
          { field: 'name', label: 'Name', type: Type.Text },
          { field: 'description', label: 'Description', type: Type.Text },
          { field: 'createdAt', label: 'Created At', type: Type.Date },
        ],
      },
      {
        id: 'users',
        label: 'Users',
        href: `${path}/users`,
        icon: faUserGroup,
        fields: [
          { field: 'name', label: 'Name', type: Type.Text },
          { field: 'email', label: 'Email', type: Type.Text },
          { field: 'role', label: 'Role', type: Type.Text },
          { field: 'userName', label: 'User Name', type: Type.Text },
          { field: 'status', label: 'Status', type: Type.Text },
          { field: 'createdAt', label: 'Created At', type: Type.Date },
        ],
      },
    ],
  };
};

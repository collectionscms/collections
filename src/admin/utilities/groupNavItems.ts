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
    label: 'index.content_management',
    items: collections.map((meta) => ({
      label: `${meta.collection}`,
      href: `/admin/collections/${meta.collection}`,
      icon: faList,
    })),
  };
};

export const profileNavItems = (): Group => {
  const path = '/admin';

  return {
    label: 'index.profile',
    items: [
      {
        label: 'index.profile',
        href: `${path}/me`,
        icon: faUser,
      },
    ],
  };
};

export const settingsGroupNavItems = (): Group => {
  const path = '/admin/settings';

  return {
    label: 'index.setting',
    items: [
      {
        label: 'index.project_setting',
        href: `${path}/project`,
        icon: faEarthAmerica,
      },
      {
        label: 'index.content_type',
        href: `${path}/content-types`,
        icon: faTable,
      },
      {
        label: 'index.role',
        href: `${path}/roles`,
        icon: faShieldHalved,
      },
      {
        label: 'index.user',
        href: `${path}/users`,
        icon: faUserGroup,
      },
    ],
  };
};

import {
  AccountCircleOutlined,
  AdminPanelSettingsOutlined,
  GroupOutlined,
  LabelOutlined,
  PublicOutlined,
  TableViewOutlined,
} from '@mui/icons-material';
import { Collection } from '../../config/types.js';
import { Group } from '../components/elements/NavItem/types.js';

export const collectionsGroupNavItems = (collections: Collection[]): Group => {
  return {
    label: 'content_management',
    items: collections.map((meta) => ({
      label: `${meta.collection}`,
      href: `/admin/collections/${meta.collection}`,
      Icon: LabelOutlined,
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
        Icon: AccountCircleOutlined,
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
        Icon: PublicOutlined,
      },
      {
        label: 'content_type',
        href: `${path}/content-types`,
        Icon: TableViewOutlined,
      },
      {
        label: 'role',
        href: `${path}/roles`,
        Icon: AdminPanelSettingsOutlined,
      },
      {
        label: 'user',
        href: `${path}/users`,
        Icon: GroupOutlined,
      },
    ],
  };
};

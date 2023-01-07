import { Group } from '@admin/components/elements/NavItem/types';
import {
  AccountCircleOutlined,
  AdminPanelSettingsOutlined,
  GroupOutlined,
  LabelOutlined,
  PublicOutlined,
  TableViewOutlined,
} from '@mui/icons-material';
import { Collection } from '@shared/types';

export const collectionsGroupNavItems = (collections: Collection[]): Group => {
  return {
    label: 'index.content_management',
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
    label: 'index.profile',
    items: [
      {
        label: 'index.profile',
        href: `${path}/me`,
        Icon: AccountCircleOutlined,
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
        Icon: PublicOutlined,
      },
      {
        label: 'index.content_type',
        href: `${path}/content-types`,
        Icon: TableViewOutlined,
      },
      {
        label: 'index.role',
        href: `${path}/roles`,
        Icon: AdminPanelSettingsOutlined,
      },
      {
        label: 'index.user',
        href: `${path}/users`,
        Icon: GroupOutlined,
      },
    ],
  };
};

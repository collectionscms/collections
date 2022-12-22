import { Label, VerifiedUser } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import { Group } from 'config/types';

export const collectionsGroupNavItems = (
  collections: Record<keyof { collection: string }, unknown>[]
): Group[] => {
  return [
    {
      id: 'group-collections',
      label: 'Content Management',
      items: collections.map((meta) => ({
        id: `${meta.collection}`,
        label: `${meta.collection}`,
        href: `/admin/collections/${meta.collection}`,
        Icon: Label,
      })),
    },
  ];
};

export const settingsGroupNavItems = (): Group[] => {
  const path = '/admin/settings';

  return [
    {
      id: 'group-settings',
      label: 'Settings',
      items: [
        {
          id: 'users',
          label: 'Users',
          href: `${path}/users`,
          Icon: PeopleIcon,
        },
        {
          id: 'roles',
          label: 'Roles',
          href: `${path}/roles`,
          Icon: VerifiedUser,
        },
      ],
    },
  ];
};

import React, { useMemo } from 'react';
import { postNavItems, settingsGroupNavItems } from '../../../utilities/groupNavItems.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { NavGroup } from '../NavGroup/index.js';
import { NavHeader } from '../NavHeader/index.js';
import { ScrollBar } from '../ScrollBar/index.js';

export const NavContent: React.FC = () => {
  const { me } = useAuth();

  const navHeader = useMemo(() => <NavHeader />, []);

  const navGroupItems = me?.isAdmin ? [postNavItems(), settingsGroupNavItems()] : [postNavItems()];
  const navGroups = navGroupItems.map((group) => {
    return <NavGroup key={group.label} group={group} />;
  });

  return (
    <>
      <ScrollBar
        sx={{
          '& .simplebar-content': {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {navHeader}
        {navGroups}
      </ScrollBar>
    </>
  );
};

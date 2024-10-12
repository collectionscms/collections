import React, { useMemo } from 'react';
import { NavGroup } from '../NavGroup/index.js';
import { Group } from '../NavGroup/types.js';
import { NavHeader } from '../NavHeader/index.js';
import { ScrollBar } from '../ScrollBar/index.js';
import { Feedback } from './Feedback/index.js';

type Props = {
  navGroupItems: Group[];
};

export const NavContent: React.FC<Props> = ({ navGroupItems }) => {
  const navHeader = useMemo(() => <NavHeader />, []);
  const navGroups = navGroupItems.map((group) => {
    return group.items.length > 0 ? <NavGroup key={group.label} group={group} /> : null;
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
      <Feedback />
    </>
  );
};

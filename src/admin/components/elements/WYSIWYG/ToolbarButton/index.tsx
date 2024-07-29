import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';

type Props = {
  children: React.ReactNode;
  shortcuts?: string[];
  onClick: () => void;
};

const isMac =
  typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false;

export const ShortcutKey: React.FC<{ shortcut: string }> = ({ shortcut }) => {
  if (shortcut === 'Mod') {
    return <Typography component="span">{isMac ? '⌘' : 'Ctrl'}</Typography>;
  }

  if (shortcut === 'Shift') {
    return <Typography component="span">⇧</Typography>;
  }

  return <Typography component="span">{shortcut}</Typography>;
};

export const ToolbarButton: React.FC<Props> = ({ children, shortcuts, onClick }) => {
  return (
    <>
      {shortcuts ? (
        <Tooltip
          title={
            <Stack gap={0.5} direction="row">
              {shortcuts.map((shortcut, index) => (
                <ShortcutKey shortcut={shortcut} key={index} />
              ))}
            </Stack>
          }
          placement="top"
        >
          <IconButton onClick={onClick} color="secondary" size="small" sx={{ borderRadius: 1.5 }}>
            {children}
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton onClick={onClick} color="secondary" size="small" sx={{ borderRadius: 1.5 }}>
          {children}
        </IconButton>
      )}
    </>
  );
};

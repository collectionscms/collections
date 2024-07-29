import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';

type Props = {
  children: React.ReactNode;
  tooltip?: string;
  shortcuts?: string[];
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const isMac = typeof window !== 'undefined' ? /Mac/i.test(navigator.userAgent) : false;

export const ShortcutKey: React.FC<{ shortcut: string }> = ({ shortcut }) => {
  if (shortcut === 'Mod') {
    return <Typography>{isMac ? '⌘' : 'Ctrl'}</Typography>;
  }

  if (shortcut === 'Shift') {
    return <Typography>⇧</Typography>;
  }

  return <Typography>{shortcut}</Typography>;
};

export const ToolbarButton: React.FC<Props> = ({ children, tooltip, shortcuts, onClick }) => {
  return (
    <>
      {tooltip ? (
        <Tooltip
          title={
            <Stack gap={1} direction="row">
              <Typography>{tooltip}</Typography>
              {shortcuts && (
                <Stack gap={0.5} direction="row">
                  {shortcuts.map((shortcut, index) => (
                    <ShortcutKey shortcut={shortcut} key={index} />
                  ))}
                </Stack>
              )}
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

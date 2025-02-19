import { IconButton, Tooltip } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { forwardRef } from 'react';

type Props = {
  children: React.ReactNode;
  tooltip?: string;
  shortcuts?: string[];
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  sx?: SxProps;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const isMac = typeof window !== 'undefined' ? /Mac/i.test(navigator.userAgent) : false;

export const ShortcutKey: React.FC<{ shortcut: string }> = ({ shortcut }) => {
  if (shortcut === 'Mod') {
    return <p>{isMac ? '⌘' : 'Ctrl'}</p>;
  }

  if (shortcut === 'Shift') {
    return <p>⇧</p>;
  }

  return <p>{shortcut}</p>;
};

export const ToolbarButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, onClick, shortcuts, color, tooltip, sx, ...rest }, ref) => {
    const content = (
      <IconButton
        onClick={onClick}
        {...rest}
        ref={ref}
        color={color || 'default'}
        size="small"
        sx={{ borderRadius: 1.5, ...sx }}
      >
        {children}
      </IconButton>
    );

    if (tooltip) {
      return (
        <Tooltip
          title={
            <div className="flex flex-row gap-1">
              <p>{tooltip}</p>
              {shortcuts && (
                <div className="flex flex-row gap-0.5">
                  {shortcuts.map((shortcut, index) => (
                    <ShortcutKey shortcut={shortcut} key={index} />
                  ))}
                </div>
              )}
            </div>
          }
          placement="top"
        >
          {content}
        </Tooltip>
      );
    }

    return content;
  }
);

ToolbarButton.displayName = 'ToolbarButton';

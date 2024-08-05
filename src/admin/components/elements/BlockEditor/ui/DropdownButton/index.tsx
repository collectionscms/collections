import { Button, ButtonOwnProps, SxProps, Theme } from '@mui/material';
import React from 'react';

export const DropdownButton = ({
  children,
  color,
  onClick,
  disabled,
  sx,
}: {
  children: React.ReactNode;
  color?: ButtonOwnProps['color'];
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Button
      variant="text"
      color={color || 'secondary'}
      sx={{
        p: 1,
        justifyContent: 'flex-start',
        ...sx,
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

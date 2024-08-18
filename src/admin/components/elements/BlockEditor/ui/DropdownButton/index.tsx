import { Button, ButtonOwnProps, SxProps, Theme, useTheme } from '@mui/material';
import React from 'react';

export const DropdownButton = ({
  children,
  color,
  isActive,
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
  const theme = useTheme();

  return (
    <Button
      variant="text"
      color={color || 'secondary'}
      sx={{
        ...sx,
        p: 1,
        justifyContent: 'flex-start',
        color: theme.palette.grey[700],
        backgroundColor: isActive ? theme.palette.grey[100] : 'transparent',
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

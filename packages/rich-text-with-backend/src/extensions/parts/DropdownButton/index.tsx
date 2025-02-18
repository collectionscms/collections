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
        px: 1,
        py: 0.5,
        justifyContent: 'flex-start',
        borderRadius: 1.5,
        color: 'inherit',
        backgroundColor: isActive ? theme.palette.secondary.main : 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

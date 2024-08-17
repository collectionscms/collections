import { Chip as MuiChip } from '@mui/material';
import React from 'react';

interface Props {
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  label?: React.ReactNode;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'light' | 'combined';
}

export const Chip = ({ color, label, size, variant }: Props) => {
  return <MuiChip color={color} label={label} size={size} variant={variant} />;
};

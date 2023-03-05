import { useTheme } from '@mui/material';
import React from 'react';
import { NavLink, LinkProps as RouterLinkProps } from 'react-router-dom';

const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
  const theme = useTheme();

  return (
    <NavLink
      ref={ref}
      {...props}
      role={undefined}
      className={({ isActive }) => (isActive ? `${props.className} Mui-selected` : props.className)}
      style={{ color: theme.palette.primary.main }}
      end
    />
  );
});

export default RouterLink;

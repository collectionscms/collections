import React from 'react';
import { NavLink, LinkProps as RouterLinkProps } from 'react-router-dom';

const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
  return (
    <NavLink
      ref={ref}
      {...props}
      role={undefined}
      className={({ isActive }) => (isActive ? `${props.className} Mui-selected` : props.className)}
      end
    />
  );
});

export default RouterLink;

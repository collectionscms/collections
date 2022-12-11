import React from 'react';
import { Link, LinkProps as RouterLinkProps } from 'react-router-dom';

const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((itemProps, ref) => {
  return <Link ref={ref} {...itemProps} role={undefined} />;
});

export default RouterLink;

import { LinkProps, Link as MuiLink } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Link: React.FC<LinkProps> = (props) => {
  return <MuiLink {...props} component={RouterLink} to={props.href ?? '#'} />;
};

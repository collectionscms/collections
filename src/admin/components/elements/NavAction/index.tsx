import { Logout } from '@mui/icons-material';
import { Avatar, Link, Stack } from '@mui/material';
import React from 'react';
import RouterLink from '../Link';

const NavAction = () => {
  return (
    <Stack direction="column" spacing={3} alignItems="left">
      <Link component={RouterLink} to="/admin/auth/logout">
        <Logout />
      </Link>
      <Avatar
        alt="profile user"
        src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
        sx={{ width: 32, height: 32 }}
      />
    </Stack>
  );
};

export default NavAction;

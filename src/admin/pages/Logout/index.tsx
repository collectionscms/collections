import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Logout: React.FC = () => {
  return (
    <Box>
      <p>ログアウトしました</p>
      <Link to="/admin/auth/login">ログイン</Link>
    </Box>
  );
};

export default Logout;

import RouterLink from '@admin/components/elements/Link';
import { Box, Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <Box>
      <p>Welcome to Superfast</p>
      <div>
        <p>Email</p>
        <input type="text" required />
      </div>
      <div>
        <p>パスワード</p>
        <input type="text" required />
      </div>
      <div>
        <Link to="/admin/auth/forgot">パスワード忘れ</Link>
      </div>
      <Button variant="contained" component={RouterLink} to="/admin/collections" sx={{ mt: 2 }}>
        ログイン
      </Button>
    </Box>
  );
};

export default LoginPage;

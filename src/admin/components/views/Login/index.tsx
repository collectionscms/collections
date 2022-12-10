import { Box, Button, Link } from '@mui/material';
import React from 'react';

const Login: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        alignItems: 'left',
        p: 3,
      }}
    >
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
        <Link href="/admin/auth/forgot">パスワード忘れ</Link>
      </div>
      <Button variant="contained" sx={{ mt: 2 }}>
        ログイン
      </Button>
    </Box>
  );
};

export default Login;

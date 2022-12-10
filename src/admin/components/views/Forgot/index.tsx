import { Box, Button, Link } from '@mui/material';
import React from 'react';

const Forgot: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        alignItems: 'left',
        p: 3,
      }}
    >
      <p>Forgot Password</p>
      <div>
        <p>Email</p>
        <input type="text" required />
      </div>
      <Button variant="contained" sx={{ mt: 2 }}>
        送信
      </Button>
      <div>
        <Link href="/admin/auth/login">ログインに戻る</Link>
      </div>
    </Box>
  );
};

export default Forgot;

import { Box, Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPage: React.FC = () => {
  return (
    <Box>
      <p>Forgot Password</p>
      <div>
        <p>Email</p>
        <input type="text" required />
      </div>
      <Button variant="contained" sx={{ mt: 2 }}>
        送信
      </Button>
      <div>
        <Link to="/admin/auth/login">ログインに戻る</Link>
      </div>
    </Box>
  );
};

export default ForgotPage;

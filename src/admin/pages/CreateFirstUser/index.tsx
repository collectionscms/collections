import { Box, Button } from '@mui/material';
import React from 'react';

const CreateFirstUserPage: React.FC = () => {
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
        <p>名前（姓）</p>
        <input type="text" required />
      </div>
      <div>
        <p>名前（名）</p>
        <input type="text" required />
      </div>
      <div>
        <p>Email</p>
        <input type="text" required />
      </div>
      <div>
        <p>パスワード</p>
        <input type="text" required />
      </div>
      <div>
        <p>パスワード（確認）</p>
        <input type="text" required />
      </div>
      <Button variant="contained" sx={{ mt: 2 }}>
        登録
      </Button>
    </Box>
  );
};

export default CreateFirstUserPage;

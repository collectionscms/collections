import { Box, Button } from '@mui/material';
import React from 'react';
import RouterLink from '../../components/elements/Link';

const ResetPassword: React.FC = () => {
  return (
    <Box>
      <p>Reset Password</p>
      <div>
        <p>Password</p>
        <input type="password" required />
      </div>
      <div>
        <p>Confirm Password</p>
        <input type="password" required />
      </div>
      <Button variant="outlined" component={RouterLink} to="/admin/collections" sx={{ mt: 2 }}>
        Change Password
      </Button>
    </Box>
  );
};

export default ResetPassword;

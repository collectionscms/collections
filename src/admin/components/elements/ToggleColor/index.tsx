import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import React, { useContext } from 'react';
import ColorModeContext from './context';

const ToggleColor: React.FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      sx={{
        width: '100%',
        alignItems: 'left',
        fontSize: 20,
        p: 3,
      }}
    >
      <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ p: 0 }}>
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
};

export default ToggleColor;

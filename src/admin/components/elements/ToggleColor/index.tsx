import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useContext } from 'react';
import ColorModeContext from './context';

const ToggleColor: React.FC = () => {
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      sx={{
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ p: 0 }}>
        <FontAwesomeIcon icon={faCircleHalfStroke} />
      </IconButton>
    </Box>
  );
};

export default ToggleColor;

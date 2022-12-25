import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import { Box, BoxProps, Button } from '@mui/material';
import React from 'react';

const Item = (props: BoxProps) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    />
  );
};

const Project: React.FC = () => {
  const { label } = useDocumentInfo();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Item>
        <h1>{label}</h1>
      </Item>
      <Item>
        <Button variant="contained">更新</Button>
      </Item>
    </Box>
  );
};

export default Project;

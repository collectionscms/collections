import RouterLink from '@admin/components/elements/Link';
import { Box, BoxProps, Button } from '@mui/material';
import React from 'react';
import { Props } from './types';

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

const Default: React.FC<Props> = ({ collection }) => {
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
        <h1>{collection}</h1>
      </Item>
      <Item>
        <Button
          variant="contained"
          component={RouterLink}
          to={`/admin/collections/${collection}/create`}
        >
          登録
        </Button>
      </Item>
    </Box>
  );
};

export default Default;

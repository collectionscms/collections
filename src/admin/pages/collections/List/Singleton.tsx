import RouterLink from '@admin/components/elements/Link';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { Box, BoxProps, Button, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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

const Singleton: React.FC<Props> = ({ collection }) => {
  // TODO Retrieve from DB
  const fields = [
    { accessor: 'name', type: Type.Text },
    { accessor: 'address', type: Type.Text },
  ];

  return (
    <Box sx={{ width: '100%' }}>
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
            to={`/admin/collections/${collection}`}
          >
            更新
          </Button>
        </Item>
      </Box>
      <Grid container spacing={3}>
        {fields.map((field) => (
          <Grid xs={12} md={6}>
            <Item>
              <Box>
                <label>{field.accessor}</label>
              </Box>
              <TextField id={field.accessor} fullWidth />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Singleton;

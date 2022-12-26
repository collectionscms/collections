import RouterLink from '@admin/components/elements/Link';
import { Box, BoxProps, Button, Checkbox, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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

const CreatePage: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Item>
          <h1>Create Collection</h1>
        </Item>
        <Item>
          <Button variant="contained" component={RouterLink} to="../content-types/1">
            登録
          </Button>
        </Item>
      </Box>
      <Grid container spacing={3} xs={12} xl={6}>
        <Grid xs={12} md={6}>
          <Item>
            <Box>
              <label>Collection Name</label>
            </Box>
            <TextField id="name" fullWidth />
          </Item>
        </Grid>
        <Grid xs={12} md={6}>
          <Item>
            <Box>
              <label>Singleton</label>
            </Box>
            <Checkbox {...{ inputProps: { 'aria-label': 'Checkbox demo' } }} defaultChecked />
          </Item>
        </Grid>
      </Grid>
    </>
  );
};

export default CreatePage;

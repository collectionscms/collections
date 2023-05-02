import { Box, Button, Drawer, Paper, Stack, TextField, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { Props } from './types.js';

const ApiPreviewImpl: React.FC<Props> = ({ slug, singleton }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { getPreviewContents } = useContent();
  const { data: contents, trigger, isMutating } = getPreviewContents(slug);

  // TODO Make host an environment variable.
  const url = `http://localhost:4000/api/collections/${slug}/contents`;

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const onFetch = () => {
    trigger();
  };

  if (!user) return <></>;

  return (
    <>
      <Button variant="contained" onClick={toggleDrawer(true)}>
        {t('api_preview')}
      </Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <Stack rowGap={3} sx={{ maxWidth: 800, p: 3 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid xs>
              <Box sx={{ border: 1, p: 1 }}>{url}</Box>
            </Grid>
            <Grid>
              <Button variant="contained" onClick={onFetch} disabled={isMutating}>
                {t('fetch')}
              </Button>
            </Grid>
          </Grid>
          <Stack>
            <Box>Headers</Box>
            <Box>{user.apiKey ? `Bearer ${user.apiKey}` : '-'}</Box>
          </Stack>
          <Paper elevation={0}>
            {`curl "${url}" -H "Authorization: Bearer
            ${user.apiKey}"`}
          </Paper>
          {contents && (
            <TextField
              multiline
              value={JSON.stringify(singleton ? contents[0] : contents, null, 2)}
              InputProps={{
                readOnly: true,
              }}
            />
          )}
        </Stack>
      </Drawer>
    </>
  );
};

export const ApiPreview = ComposeWrapper({ context: ContentContextProvider })(ApiPreviewImpl);

import { useAuth } from '@admin/components/utilities/Auth';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { useConfig } from '@admin/components/utilities/Config';
import { Box, Button, Drawer, Paper, Stack, TextField, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentContextProvider, useContent } from '../Context';
import { Props } from './types';

const ApiPreview: React.FC<Props> = ({ slug, singleton }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const { config } = useConfig();
  const [open, setOpen] = useState(false);
  const { getPreviewContents } = useContent();
  const { data: contents, trigger, isMutating } = getPreviewContents(slug);

  const url = `${config.serverUrl}/api/collections/${slug}/contents`;

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
    return;
  };

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

export default ComposeWrapper({ context: ContentContextProvider })(ApiPreview);

import { Send } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, TextField, Tooltip, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'superfast-ui';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { ContentContextProvider } from '../Context/index.js';
import { Props } from './types.js';

const ApiPreviewImpl: React.FC<Props> = ({ collection, singleton }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { token } = useAuth();
  const [open, setOpen] = useState(false);

  const url = `${process.env.PUBLIC_SERVER_URL}/api/collections/${collection}/contents`;

  const [content, setContent] = useState<string | undefined>();

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

  const onFetch = async () => {
    const result = await axios(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    setContent(JSON.stringify(result.data, null, '\t'));
  };

  return (
    <>
      <Tooltip title={t('api_preview')}>
        <IconButton color="secondary" onClick={toggleDrawer(true)}>
          <Send />
        </IconButton>
      </Tooltip>
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
              <Button variant="contained" onClick={onFetch}>
                {t('fetch')}
              </Button>
            </Grid>
          </Grid>
          <Stack>
            <Box>Headers</Box>
            <Box>{token}</Box>
          </Stack>
          <Box>{`curl "${url}" -H "Authorization: Bearer ${token}"`}</Box>
          {content && (
            <TextField
              multiline
              value={content}
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

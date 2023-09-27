import { ArrowRightOutlined, SendOutlined } from '@ant-design/icons';
import { IconButton, MainCard, SyntaxHighlighter } from '@collectionscms/plugin-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Drawer,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../components/elements/Link/index.js';
import { ScrollBar } from '../../../components/elements/ScrollBar/index.js';
import { TabPanel } from '../../../components/elements/TabPanel/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  apiPreview as apiPreviewSchema,
} from '../../../fields/schemas/models/apiPreview.js';
import { ContentContextProvider } from '../Context/index.js';
import { Props } from './types.js';

const ApiPreviewImpl: React.FC<Props> = ({ modelId }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | undefined>();
  const [tabIndex] = useState(0);

  const { t } = useTranslation();
  const { apiKey } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(apiPreviewSchema),
  });

  useEffect(() => {
    setValue('path', `api/models/${modelId}/contents`);
  }, [modelId]);

  const host = `${process.env.PUBLIC_SERVER_URL}/`;
  const curlCodeString = `curl "${host}${watch('path')}" -H "Authorization: Bearer ${apiKey}"`;

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

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues, event) => {
    event?.preventDefault();

    try {
      const requestUrl = `${host}${form.path}`;
      const result = await axios(requestUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey,
        },
      });
      setContent(JSON.stringify(result.data, null, '\t'));
    } catch (e) {
      if (e instanceof AxiosError && e.response?.data) {
        setContent(JSON.stringify(e.response.data, null, '\t'));
      } else {
        setContent(JSON.stringify(e, null, '\t'));
      }
    }
  };

  return (
    <>
      <Tooltip title={t('api_preview')} arrow placement="top">
        <IconButton color="secondary" onClick={toggleDrawer(true)}>
          <SendOutlined style={{ fontSize: '20px' }} />
        </IconButton>
      </Tooltip>
      <Stack>
        <Drawer
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: { xs: 340, md: 660 },
            },
          }}
        >
          <ScrollBar
            sx={{
              '& .simplebar-content': {
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Stack
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Controller
                  name="path"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="API Path"
                      type="text"
                      fullWidth
                      InputProps={{
                        startAdornment: `${process.env.PUBLIC_SERVER_URL}/`,
                      }}
                      error={errors.path !== undefined}
                    />
                  )}
                />
                <Button variant="contained" type="submit">
                  {t('fetch')}
                </Button>
              </Stack>
            </Box>
            <Stack sx={{ px: 3 }} rowGap={1}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex}>
                  <Tab label="cURL" iconPosition="start" />
                </Tabs>
              </Box>
              <TabPanel value={tabIndex} index={0}>
                <MainCard codeHighlight codeString={curlCodeString}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">{t('api_key')}</Typography>
                    {apiKey ? (
                      <Typography sx={{ wordBreak: 'break-all' }}>{apiKey}</Typography>
                    ) : (
                      <Link href="/admin/me">
                        <ArrowRightOutlined style={{ marginRight: 2 }} />
                        {t('go_to_registration')}
                      </Link>
                    )}
                  </Stack>
                </MainCard>
              </TabPanel>
            </Stack>
            <Box sx={{ p: 3 }}>
              <MainCard codeHighlight content={false}>
                <SyntaxHighlighter language="json" codeString={content || 'No data'} />
              </MainCard>
            </Box>
          </ScrollBar>
        </Drawer>
      </Stack>
    </>
  );
};

export const ApiPreview = ComposeWrapper({ context: ContentContextProvider })(ApiPreviewImpl);

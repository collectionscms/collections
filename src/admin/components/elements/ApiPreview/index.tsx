import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Drawer,
  FormControl,
  IconButtonProps,
  Link,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { ApiKey } from '@prisma/client';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { SyntaxHighlighter } from '../../../@extended/components/SyntaxHighlighter/index.js';
import { ButtonVariantProps, IconButtonShapeProps } from '../../../@extended/types/extended.js';
import { ScrollBar } from '../../../components/elements/ScrollBar/index.js';
import {
  FormValues,
  getDataValidator,
} from '../../../fields/validators/apiPreviews/getData.validator.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { Icon } from '../Icon/index.js';
import { TabPanel } from '../TabPanel/index.js';

type Props = {
  path: string;
  apiKeys: ApiKey[];
  buttonProps: IconButtonProps & { shape?: IconButtonShapeProps; variant?: ButtonVariantProps };
};

export const ApiPreview: React.FC<Props> = ({ path, buttonProps, apiKeys }) => {
  const { hasPermission } = useAuth();
  const [open, setOpen] = useState(false);
  const [tabIndex] = useState(0);
  const [content, setContent] = useState<string | undefined>();
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string | undefined>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(getDataValidator),
    defaultValues: {
      path,
    },
  });

  useEffect(() => {
    setApiKey(apiKeys[0]?.key);
  }, [apiKeys]);

  const basePath = `${window.location.origin}/api/v1`;
  const curlCodeString = `curl "${basePath}/${watch('path')}" -H "Authorization: Bearer ${apiKey}"`;

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
      const requestUrl = `${basePath}/${form.path}`;
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey,
        },
        credentials: 'omit',
      });
      const result = await response.json();
      setContent(JSON.stringify(result, null, '\t'));
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
            <Stack sx={{ px: 3 }} rowGap={1}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex}>
                  <Tab label="cURL" iconPosition="start" />
                </Tabs>
              </Box>
              <TabPanel value={tabIndex} index={0}>
                <MainCard codeHighlight codeString={curlCodeString}>
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
                            startAdornment: (
                              <Typography
                                sx={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: 'inline-block',
                                  minWidth: '50%',
                                }}
                              >
                                {basePath}/
                              </Typography>
                            ),
                          }}
                          error={errors.path !== undefined}
                        />
                      )}
                    />
                    <Button variant="contained" type="submit" size="medium">
                      {t('fetch')}
                    </Button>
                  </Stack>
                  <Stack spacing={0.5} sx={{ mt: 3 }}>
                    <Typography color="secondary">{t('api_key')}</Typography>
                    {!hasPermission('readApiKey') ? (
                      <>{t('no_permissions')}</>
                    ) : (
                      <>
                        {apiKey ? (
                          <FormControl fullWidth>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={apiKey}
                              placeholder="Age"
                              onChange={(e) => setApiKey(e.target.value)}
                            >
                              {apiKeys.map((apiKey) => (
                                <MenuItem key={apiKey.key} value={apiKey.key}>
                                  {apiKey.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Link href="/admin/settings/api-keys">
                            <Stack alignItems="center" direction="row" gap={0.5}>
                              <Icon name="ChevronRight" size={18} />
                              {t('go_to_registration')}
                            </Stack>
                          </Link>
                        )}
                      </>
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

      {/* Button */}
      <Tooltip title={t('api_preview')} arrow placement="top">
        <IconButton {...buttonProps} onClick={toggleDrawer(true)}>
          <Icon name="SendHorizontal" size={18} />
        </IconButton>
      </Tooltip>
    </>
  );
};

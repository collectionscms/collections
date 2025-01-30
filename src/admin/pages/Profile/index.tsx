import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Divider,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectCha,
  TypographyngeEvent,
  Stack,
  TextField,
  useTheme,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { enqueueSnackbar } from 'notistack';
import React, { ChangeEvent, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../utilities/logger.js';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../components/elements/ConfirmDiscardDialog/index.js';
import { Icon } from '../../components/elements/Icon/index.js';
import { Loader } from '../../components/elements/Loader/index.js';
import { useColorMode } from '../../components/utilities/ColorMode/index.js';
import { Mode } from '../../components/utilities/ColorMode/types.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateUser as updateUserSchema,
} from '../../fields/validators/profiles/updateUser.validator.js';
import { useUnsavedChangesPrompt } from '../../hooks/useUnsavedChangesPrompt.js';
import lazy from '../../utilities/lazy.js';
import { ProfileContextProvider, useProfile } from './Context/index.js';
import { TitleTooltip } from '../Post/Edit/PostHeader/PublishSettings/ui/TitleTooltip/index.js';

const Loading = Loader(lazy(() => import('../../components/elements/Loading/index.js'), 'Loading'));

const ProfilePageImpl: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode, autoMode } = useColorMode();
  const theme = useTheme();
  const { getProfile, updateMe, createFileImage } = useProfile();
  const { data: user } = getProfile();
  const { trigger, isMutating } = updateMe();
  const { trigger: createFileImageTrigger } = createFileImage();
  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name ?? '',
      bio: user?.bio ?? '',
    },
    resolver: yupResolver(updateUserSchema(t)),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  // /////////////////////////////////////
  // Avatar
  // /////////////////////////////////////

  const [avatar, setAvatar] = useState<string | undefined>(user?.image ?? undefined);

  const handleUploadImage = async (file: File | undefined) => {
    if (!file) return;

    const params = new FormData();
    params.append('file', file);

    const res = await createFileImageTrigger(params);
    const uploadedFile = res.files[0];
    setAvatar(uploadedFile.url);
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger({
        ...form,
        image: avatar,
      });
      enqueueSnackbar(t('toast.updated_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } catch (e) {
      logger.error(e);
    }
  };

  if (!user) return <Loading />;

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        <Grid xs={12} md={10}>
          <MainCard>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>{t('language')}</InputLabel>
                  <Select
                    name="language"
                    displayEmpty
                    value={i18n.language}
                    onChange={handleChange}
                  >
                    <MenuItem value="ja">{t('japanese')}</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </Stack>
              </Grid>
              <Grid xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>{t('theme')}</InputLabel>
                  <RadioGroup
                    name="theme"
                    row
                    value={autoMode ? 'auto' : mode}
                    onChange={(e) => setMode(e.target.value as Mode)}
                  >
                    <FormControlLabel value="auto" control={<Radio />} label={t('automatic')} />
                    <FormControlLabel value="light" control={<Radio />} label={t('light')} />
                    <FormControlLabel value="dark" control={<Radio />} label={t('dark')} />
                  </RadioGroup>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
      <Grid container spacing={2.5}>
        <Grid xs={12} md={10}>
          <MainCard content={false} title={t('personal_information')}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3} sx={{ p: 2.5 }}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('name')}</InputLabel>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.name !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.name?.message}</FormHelperText>
                  </Stack>
                </Grid>
              </Grid>
              <Box>
                <CardHeader title={t('author_seo')} subheader={t('author_seo_description')} />
                <Divider />
              </Box>
              <Grid container spacing={3} sx={{ p: 2.5 }}>
                <Grid xs={12}>
                  <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                    <FormLabel
                      htmlFor="change-avatar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer',
                      }}
                    >
                      <Avatar alt="avatar" src={avatar} sx={{ width: 76, height: 76 }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor:
                            mode === 'dark' ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon
                          name="Camera"
                          size={32}
                          classNames={{
                            color: theme.palette.secondary.lighter,
                          }}
                        />
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avatar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      InputProps={{
                        inputProps: {
                          accept: '.jpg,.jpeg,.png,.gif',
                        },
                      }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleUploadImage(e.target.files?.[0])
                      }
                    />
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>{t('bio')}</InputLabel>
                    <Controller
                      name="bio"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          multiline
                          rows={3}
                          error={errors.bio !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.bio?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack direction="row" alignItems="right" justifyContent="right">
                    <Button variant="contained" type="submit" disabled={isMutating}>
                      {t('update')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export const ProfilePage = ComposeWrapper({ context: ProfileContextProvider })(ProfilePageImpl);

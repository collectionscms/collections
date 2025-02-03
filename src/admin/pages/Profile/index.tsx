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
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { enqueueSnackbar } from 'notistack';
import React, { ChangeEvent } from 'react';
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
import { Award } from './parts/Award/index.js';
import { SpokenLanguage } from './parts/SpokenLanguage/index.js';

const Loading = Loader(lazy(() => import('../../components/elements/Loading/index.js'), 'Loading'));

const ProfilePageImpl: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode, autoMode } = useColorMode();
  const theme = useTheme();
  const { getProfile, updateMe, createFileImage } = useProfile();
  const {
    data: { user, socialProfiles, alumni, spokenLanguages, awards },
  } = getProfile();

  const { trigger, isMutating } = updateMe();
  const { trigger: createFileImageTrigger } = createFileImage();

  const getSocialUrl = (provider: string): string =>
    socialProfiles.find((profile) => profile.provider === provider)?.url ?? '';

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name ?? '',
      bio: user?.bio ?? '',
      bioUrl: user?.bioUrl ?? '',
      employer: user?.employer ?? '',
      jobTitle: user?.jobTitle ?? '',
      image: user?.image ?? '',
      xUrl: getSocialUrl('x'),
      instagramUrl: getSocialUrl('instagram'),
      facebookUrl: getSocialUrl('facebook'),
      linkedInUrl: getSocialUrl('linkedIn'),
      awards: awards.map((award) => award.name),
      spokenLanguages: spokenLanguages.map((spokenLanguage) => spokenLanguage.language),
      alumni: alumni.map((alumnus) => ({
        name: alumnus.name,
        url: alumnus.url,
      })),
    },
    resolver: yupResolver(updateUserSchema(t)),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  // /////////////////////////////////////
  // Alumni
  // /////////////////////////////////////

  const handleAddAlumni = () => {
    setValue('alumni', [...(watch('alumni') ?? []), { name: '', url: '' }]);
  };

  const handleChangeAlumni = (index: number, key: 'name' | 'url', value: string) => {
    const newAlumniValues = [...(watch('alumni') ?? [])];
    newAlumniValues[index][key] = value;
    setValue('alumni', newAlumniValues);
  };

  const handleRemoveAlumni = (index: number) => {
    const alumni = watch('alumni') ?? [];
    if (alumni.length === 1) {
      setValue('alumni', [{ name: '', url: '' }]);
    } else {
      const newAlumniValues = alumni.filter((_, i) => i !== index);
      setValue('alumni', newAlumniValues);
    }
  };

  // /////////////////////////////////////
  // Avatar
  // /////////////////////////////////////

  const handleUploadImage = async (file: File | undefined) => {
    if (!file) return;

    const params = new FormData();
    params.append('file', file);

    const res = await createFileImageTrigger(params);
    const uploadedFile = res.files[0];
    setValue('image', uploadedFile.url);
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
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
                      <Avatar
                        alt="avatar"
                        src={watch('image') ?? ''}
                        sx={{ width: 76, height: 76 }}
                      />
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
                    <MainCard title={t('alumni_of')} content={false}>
                      <Grid spacing={3} sx={{ py: 2, px: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Typography sx={{ width: '400px' }}>{t('institution_name')}</Typography>
                          <Typography>{t('url')}</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          {watch('alumni')?.map((value, index) => (
                            <Stack direction="row" spacing={1} alignItems="center" key={index}>
                              <TextField
                                id="name"
                                type="text"
                                value={value.name}
                                sx={{ width: '400px' }}
                                onChange={(e) => handleChangeAlumni(index, 'name', e.target.value)}
                              />
                              <TextField
                                id="url"
                                type="text"
                                value={value.url}
                                sx={{ flexGrow: 1 }}
                                placeholder="https://..."
                                onChange={(e) => handleChangeAlumni(index, 'url', e.target.value)}
                              />
                              <IconButton onClick={() => handleRemoveAlumni(index)}>
                                <Icon name="Trash2" size={16} />
                              </IconButton>
                            </Stack>
                          ))}
                        </Stack>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<Icon name="Plus" size={16} />}
                          sx={{ mt: 2 }}
                          onClick={handleAddAlumni}
                        >
                          <Typography>{t('add_row')}</Typography>
                        </Button>
                      </Grid>
                    </MainCard>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('employer')}</InputLabel>
                    <Controller
                      name="employer"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.employer !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.employer?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('job_title')}</InputLabel>
                    <Controller
                      name="jobTitle"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.jobTitle !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.jobTitle?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('awards')}</InputLabel>
                    <Award
                      initialAwards={watch('awards') ?? []}
                      onChange={(values) => {
                        setValue('awards', values);
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('spoken_languages')}</InputLabel>
                    <SpokenLanguage
                      initialLanguages={watch('spokenLanguages') ?? []}
                      onChange={(values) => {
                        setValue('spokenLanguages', values);
                      }}
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
                  <Stack spacing={1}>
                    <InputLabel>{t('bio_url')}</InputLabel>
                    <Controller
                      name="bioUrl"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          placeholder="https://..."
                          error={errors.bioUrl !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.bioUrl?.message}</FormHelperText>
                  </Stack>
                </Grid>
                {/* Social Profiles */}
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Icon name="X" size={20} />
                      <InputLabel>{t('x_url')}</InputLabel>
                    </Stack>
                    <Controller
                      name="xUrl"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          placeholder="https://..."
                          error={errors.xUrl !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.xUrl?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Icon name="Facebook" size={20} />
                      <InputLabel>{t('facebook_url')}</InputLabel>
                    </Stack>
                    <Controller
                      name="facebookUrl"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          placeholder="https://..."
                          error={errors.facebookUrl !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.facebookUrl?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Icon name="Instagram" size={20} />
                      <InputLabel>{t('instagram_url')}</InputLabel>
                    </Stack>
                    <Controller
                      name="instagramUrl"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          placeholder="https://..."
                          error={errors.instagramUrl !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.instagramUrl?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Icon name="Linkedin" size={20} />
                      <InputLabel>{t('linkedin_url')}</InputLabel>
                    </Stack>
                    <Controller
                      name="linkedInUrl"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          placeholder="https://..."
                          error={errors.linkedInUrl !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.linkedInUrl?.message}</FormHelperText>
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

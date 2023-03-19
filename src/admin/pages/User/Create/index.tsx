/* eslint-disable import/no-extraneous-dependencies */
import { yupResolver } from '@hookform/resolvers/yup';
import { CachedOutlined } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Loading from '../../../components/elements/Loading';
import ComposeWrapper from '../../../components/utilities/ComposeWrapper';
import { useDocumentInfo } from '../../../components/utilities/DocumentInfo';
import createUserSchema, { FormValues } from '../../../fields/schemas/users/createUser';
import { UserContextProvider, useUser } from '../Context';

const CreateUserPage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createUser, getRoles } = useUser();
  const { data: createdUser, trigger, isMutating } = createUser();
  const { data: roles } = getRoles({ suspense: true });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      apiKey: '',
      isActive: true,
      roleId: roles ? roles[0]?.id.toString() : '',
    },
    resolver: yupResolver(createUserSchema(t)),
  });

  useEffect(() => {
    if (createdUser === undefined) return;
    enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
    navigate('../users');
  }, [createdUser]);

  const onGenerateApiKey = () => {
    setValue('apiKey', uuidv4());
  };

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    trigger(form);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs={12} sm>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid>
              <Button variant="contained" type="submit" disabled={isMutating}>
                {t('save')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
            <InputLabel required>{t('last_name')}</InputLabel>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  name="lastName"
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.lastName !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.lastName?.message}</FormHelperText>
          </Grid>
          <Grid xs={1}>
            <InputLabel required>{t('first_name')}</InputLabel>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  name="firstName"
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.firstName !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.firstName?.message}</FormHelperText>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
            <InputLabel required>{t('user_name')}</InputLabel>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <TextField
                  name="userName"
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.userName !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.userName?.message}</FormHelperText>
          </Grid>
          <Grid xs={1}>
            <InputLabel required>{t('email')}</InputLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  name="email"
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.email !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.email?.message}</FormHelperText>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
            <InputLabel required>{t('password')}</InputLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  name="password"
                  {...field}
                  type="password"
                  fullWidth
                  error={errors.password !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.password?.message}</FormHelperText>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1} md={2}>
            <InputLabel>{t('api_key')}</InputLabel>
            <Controller
              name="apiKey"
              control={control}
              render={({ field }) => (
                <TextField
                  name="apiKey"
                  {...field}
                  type="text"
                  placeholder={t('generate_api_key_placeholder')}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={t('generate_api_key')} placement="top">
                          <IconButton aria-label="generate api key" onClick={onGenerateApiKey}>
                            <CachedOutlined />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  error={errors.apiKey !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.apiKey?.message}</FormHelperText>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
            <InputLabel>{t('role')}</InputLabel>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Select name="roleId" {...field} fullWidth>
                  {roles &&
                    roles.map((role) => (
                      <MenuItem value={role.id} key={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </Grid>
          <Grid xs={1}>
            <InputLabel>{t('status')}</InputLabel>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  name="isActive"
                  {...field}
                  label={t('is_active')}
                  control={<Checkbox checked={field.value} />}
                />
              )}
            />
            <FormHelperText error>{errors.isActive?.message}</FormHelperText>
          </Grid>
        </Grid>
      </Stack>
    </Suspense>
  );
};

export default ComposeWrapper({ context: UserContextProvider })(CreateUserPage);

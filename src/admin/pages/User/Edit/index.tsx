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
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../../config/types.js';
import { logger } from '../../../../utilities/logger.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { Loading } from '../../../components/elements/Loading/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateUser as updateUserSchema,
} from '../../../fields/schemas/users/updateUser.js';
import { UserContextProvider, useUser } from '../Context/index.js';

const EditUserPageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getRoles, getUser, updateUser } = useUser();
  const { data: user, trigger: getUserTrigger } = getUser(id);
  const { data: roles } = getRoles({ suspense: true });
  const { data: updatedUser, trigger, isMutating } = updateUser(id);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(updateUserSchema(t)),
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getUserTrigger();
        if (user) setDefaultValue(user);
      } catch (error) {
        logger.error(error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (updatedUser === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    navigate('../users');
  }, [updatedUser]);

  const setDefaultValue = (user: User) => {
    setValue('first_name', user.first_name);
    setValue('last_name', user.last_name);
    setValue('user_name', user.user_name);
    setValue('email', user.email);
    setValue('password', '');
    setValue('api_key', '');
    setValue('is_active', Boolean(user.is_active));
    setValue('role_id', user.role!.id.toString());
  };

  const onGenerateApiKey = () => {
    setValue('api_key', uuidv4());
  };

  const navigateToList = () => {
    navigate('../users');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    if (!form.password) delete form.password;
    if (!form.api_key) delete form.api_key;

    try {
      await trigger(form);
    } catch (e) {
      logger.error(e);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('last_name')}</InputLabel>
                    <Controller
                      name="last_name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.last_name !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.last_name?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('first_name')}</InputLabel>
                    <Controller
                      name="first_name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.first_name !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.first_name?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('user_name')}</InputLabel>
                    <Controller
                      name="user_name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.user_name !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.user_name?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('email')}</InputLabel>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.email !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.email?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('password')}</InputLabel>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="password"
                          placeholder={t('hidden_for_security')}
                          fullWidth
                          error={errors.password !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.password?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>{t('api_key')}</InputLabel>
                    <Controller
                      name="api_key"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          placeholder={
                            user.api_key
                              ? t('hidden_for_security')
                              : t('generate_api_key_placeholder')
                          }
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title={t('generate_api_key')} placement="top">
                                  <IconButton
                                    aria-label="generate api key"
                                    onClick={onGenerateApiKey}
                                  >
                                    <CachedOutlined />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          error={errors.api_key !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.api_key?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('role')}</InputLabel>
                    <Controller
                      name="role_id"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} fullWidth>
                          {roles &&
                            roles.map((role) => (
                              <MenuItem value={role.id} key={role.id}>
                                {role.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('status')}</InputLabel>
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          {...field}
                          label={t('is_active')}
                          control={<Checkbox checked={field.value} />}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.is_active?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: 1 }}
                  >
                    <DeleteButton id={id} slug="users" onSuccess={navigateToList} />
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="secondary" onClick={navigateToList}>
                        {t('cancel')}
                      </Button>
                      <Button variant="contained" type="submit" disabled={isMutating}>
                        {t('update')}
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </MainCard>
        </Grid>
      </Grid>
    </Suspense>
  );
};

export const EditUserPage = ComposeWrapper({ context: UserContextProvider })(EditUserPageImpl);

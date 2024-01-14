import { SyncOutlined } from '@ant-design/icons';
import { IconButton, MainCard } from '@collectionscms/plugin-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
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
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateUser as updateUserSchema,
} from '../../../fields/schemas/users/updateUser.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { UserContextProvider, useUser } from '../Context/index.js';

const EditUserPageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getRoles, getUser, updateUser } = useUser();
  const { data: user } = getUser(id);
  const { data: roles } = getRoles();
  const { trigger, isMutating } = updateUser(id);
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: '',
      apiKey: '',
      isActive: Boolean(user.isActive),
      roleId: user.roleId,
    },
    resolver: yupResolver(updateUserSchema(t)),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const handleGenerateApiKey = () => {
    setValue('apiKey', uuidv4());
  };

  const navigateToList = () => {
    navigate('../users');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    if (!form.password) delete form.password;
    if (!form.apiKey) delete form.apiKey;

    try {
      reset(form);
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      navigate('../users');
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
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
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="apiKey">{t('api_key')}</InputLabel>
                    <Controller
                      name="apiKey"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="apiKey"
                          type="text"
                          placeholder={
                            user.apiKey
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
                                    edge="end"
                                    color="secondary"
                                    onClick={handleGenerateApiKey}
                                  >
                                    <SyncOutlined />
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
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('role')}</InputLabel>
                    <Controller
                      name="roleId"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} fullWidth>
                          {roles.map((role) => (
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
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          {...field}
                          label={t('is_active')}
                          control={<Checkbox checked={field.value} />}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.isActive?.message}</FormHelperText>
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
    </>
  );
};

export const EditUserPage = ComposeWrapper({ context: UserContextProvider })(EditUserPageImpl);

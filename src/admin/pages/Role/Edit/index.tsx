import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PermissionsAction, Role } from '../../../../config/types.js';
import { DeleteHeaderButton } from '../../../components/elements/DeleteHeaderButton/index.js';
import { Loading } from '../../../components/elements/Loading/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { useDocumentInfo } from '../../../components/utilities/DocumentInfo/index.js';
import {
  FormValues,
  updateRole as updateRoleSchema,
} from '../../../fields/schemas/roles/updateRole.js';
import { RoleContextProvider, useRole } from '../Context/index.js';
import { PermissionHeaderCell } from './HeaderCell/index.js';
import { PermissionToggleButton } from './ToggleButton/index.js';

const EditRolePageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getRole, getCollections, getPermissions, updateRole } = useRole();
  const { data: role, trigger: getRoleTrigger } = getRole(id);
  const { data: collections = [] } = getCollections({ suspense: true });
  const { data: permissions = [], mutate } = getPermissions(id, { suspense: true });
  const {
    data: updatedRole,
    trigger: updateRoleTrigger,
    isMutating: isUpdateRoleMutating,
  } = updateRole(id);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(updateRoleSchema()),
  });
  const actions: PermissionsAction[] = ['create', 'read', 'update', 'delete'];

  useEffect(() => {
    const getRole = async () => {
      const role = await getRoleTrigger();
      if (role) setDefaultValue(role);
    };

    getRole();
  }, []);

  useEffect(() => {
    if (updatedRole === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    navigate('../roles');
  }, [updatedRole]);

  const setDefaultValue = (role: Role) => {
    setValue('name', role.name);
    setValue('description', role.description);
    setValue('adminAccess', Boolean(role.adminAccess));
  };

  const handleDeletionSuccess = () => {
    navigate(`../roles`);
  };

  const handlePermissionSuccess = (permissionId: number) => {
    mutate(permissions.filter((permission) => permission.id !== permissionId));
  };

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    updateRoleTrigger(form);
  };

  if (!role) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid>
              <DeleteHeaderButton id={id} slug="roles" onSuccess={handleDeletionSuccess} />
            </Grid>
            <Grid>
              <Button variant="contained" type="submit" disabled={isUpdateRoleMutating}>
                {t('update')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1} md={2}>
            {role.adminAccess ? (
              <span>{t('admin_has_all_permissions')}</span>
            ) : (
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('content_type')}
                      </TableCell>
                      {actions.map((action) => (
                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          key={action}
                          sx={{ width: 40 }}
                        >
                          <PermissionHeaderCell action={action} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {collections.map((collection) => {
                      return (
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          key={collection.id}
                        >
                          <TableCell component="td" scope="row" sx={{ py: 0 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <p>{collection.collection}</p>
                            </Box>
                          </TableCell>
                          {actions.map((action) => (
                            <TableCell component="td" scope="row" key={action} sx={{ py: 0 }}>
                              <PermissionToggleButton
                                roleId={id}
                                permissions={permissions}
                                collection={collection.collection}
                                action={action}
                                onSuccess={handlePermissionSuccess}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
            <InputLabel required>{t('name')}</InputLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="text" fullWidth error={errors.name !== undefined} />
              )}
            />
            <FormHelperText error>{errors.name?.message}</FormHelperText>
          </Grid>
          <Grid xs={1}>
            <InputLabel>{t('admin_access')}</InputLabel>
            <Controller
              name="adminAccess"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  label={t('is_active')}
                  control={<Checkbox checked={field.value} />}
                />
              )}
            />
            <FormHelperText error>{errors.adminAccess?.message}</FormHelperText>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1} md={2}>
            <InputLabel>{t('description')}</InputLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.description !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.description?.message}</FormHelperText>
          </Grid>
        </Grid>
      </Stack>
    </Suspense>
  );
};

export const EditRolePage = ComposeWrapper({ context: RoleContextProvider })(EditRolePageImpl);

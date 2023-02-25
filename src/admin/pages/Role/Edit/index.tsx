import DeleteHeaderButton from '@admin/components/elements/DeleteHeaderButton';
import Loading from '@admin/components/elements/Loading';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import updateRoleSchema, { FormValues } from '@admin/fields/schemas/roles/updateRole';
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
  TableRow,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { RoleContextProvider, useRole } from '../Context';

const EditRolePage: React.FC = () => {
  const { id } = useParams();
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getRole, getCollections, updateRole } = useRole();
  const { data: role } = getRole(id, { suspense: true });
  const { data: collections } = getCollections({ suspense: true });
  const {
    data: updatedRole,
    trigger: updateRoleTrigger,
    isMutating: isUpdateRoleMutating,
  } = updateRole(id);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: role.name,
      description: role.description,
      adminAccess: role.adminAccess,
    },
    resolver: yupResolver(updateRoleSchema()),
  });

  const handleDeletionSuccess = () => {
    navigate(`../roles`);
  };

  useEffect(() => {
    if (updatedRole === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    navigate('../roles');
  }, [updatedRole]);

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    updateRoleTrigger(form);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid>
              <DeleteHeaderButton id={id} slug={`roles`} onSuccess={handleDeletionSuccess} />
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
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  {collections.map((collection) => {
                    return (
                      <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        key={collection.id}
                      >
                        <TableCell component="th" scope="row" sx={{ py: 0 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <p>{collection.collection}</p>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
            <InputLabel required>{t('name')}</InputLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  name="name"
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.name !== undefined}
                />
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
                  name="isActive"
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
                  name="description"
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

export default ComposeWrapper({ context: RoleContextProvider })(EditRolePage);

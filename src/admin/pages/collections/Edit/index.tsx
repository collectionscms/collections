import DeleteHeaderButton from '@admin/components/elements/DeleteHeaderButton';
import RenderFields from '@admin/components/forms/RenderFields';
import { useAuth } from '@admin/components/utilities/Auth';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { ContentContextProvider, useContent } from '@admin/stores/Content';
import { Button, Drawer, Stack, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ApiPreview from '../ApiPreview';
import { Props } from './types';

const EditPage: React.FC<Props> = ({ collection }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { id } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { getContent, getFields, createContent, updateContent } = useContent();
  const { data: metaFields, error: getFieldsError } = getFields(collection.collection);
  const { data: content, error: getContentError } = getContent(collection.collection, id);
  const {
    data: createdContent,
    trigger: createTrigger,
    isMutating: isCreateMutating,
  } = createContent(collection.collection);
  const {
    data: updatedContent,
    trigger: updateTrigger,
    isMutating: isUpdateMutating,
  } = updateContent(collection.collection, content?.id);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const setDefaultValue = (content: Record<string, any>) => {
    metaFields
      .filter((field) => !field.hidden)
      .forEach((field) => {
        setValue(field.field, content[field.field]);
      });
  };

  useEffect(() => {
    if (content === undefined) return;
    setDefaultValue(content);
  }, [content]);

  useEffect(() => {
    if (getFieldsError === undefined) return;
    enqueueSnackbar(getFieldsError, { variant: 'error' });
  }, [getFieldsError]);

  useEffect(() => {
    if (getContentError === undefined) return;
    enqueueSnackbar(getContentError, { variant: 'error' });
  }, [getContentError]);

  useEffect(() => {
    if (createdContent === undefined) return;
    enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
    navigate(`/admin/collections/${collection.collection}`);
  }, [createdContent]);

  useEffect(() => {
    if (updatedContent === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    navigate(`/admin/collections/${collection.collection}`);
  }, [updatedContent]);

  const handleDeletionSuccess = () => {
    navigate(`/admin/collections/${collection.collection}`);
  };

  const onSubmit = (data) => {
    if (id) {
      updateTrigger(data);
    } else {
      createTrigger(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <ApiPreview path={`${collection.collection}/${id}`} />
      </Drawer>
      <Grid container spacing={2}>
        <Grid xs={12} sm>
          <h1>
            {id
              ? t('edit.custom', { page: collection.collection })
              : t('create.custom', { page: collection.collection })}
          </h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          {id ? (
            <>
              <Grid>
                <DeleteHeaderButton
                  id={id}
                  slug={`collections/${collection.collection}/contents`}
                  disabled={!hasPermission(collection.collection, 'delete')}
                  onSuccess={handleDeletionSuccess}
                />
              </Grid>
              <Grid>
                <Button variant="contained" onClick={toggleDrawer(true)}>
                  {t('api_preview')}
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!hasPermission(collection.collection, 'update') || isUpdateMutating}
                >
                  {t('update')}
                </Button>
              </Grid>
            </>
          ) : (
            <Grid>
              <Button variant="contained" type="submit" disabled={isCreateMutating}>
                {t('create_new')}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid container columns={{ xs: 1, lg: 2 }}>
        <Grid xs={1}>
          <Stack rowGap={3}>
            <RenderFields register={register} errors={errors} fields={metaFields || []} />
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default ComposeWrapper({ context: ContentContextProvider })(EditPage);

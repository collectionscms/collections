import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteHeaderButton from '../../../components/elements/DeleteHeaderButton';
import RenderFields from '../../../components/forms/RenderFields';
import { useAuth } from '../../../components/utilities/Auth';
import ComposeWrapper from '../../../components/utilities/ComposeWrapper';
import { ContentContextProvider, useContent } from '../../../pages/collections/Context';
import ApiPreview from '../ApiPreview';
import { Props } from './types';

const EditPage: React.FC<Props> = ({ collection }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { getContent, getFields, createContent, updateContent } = useContent();
  const { data: metaFields } = getFields(collection.collection);
  const { data: content } = getContent(collection.collection, id);
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
                <ApiPreview slug={collection.collection} singleton={collection.singleton} />
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
              <Button
                variant="contained"
                type="submit"
                disabled={!hasPermission(collection.collection, 'create') || isCreateMutating}
              >
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

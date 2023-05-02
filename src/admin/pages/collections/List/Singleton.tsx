import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { RenderFields } from '../../../components/forms/RenderFields/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { ApiPreview } from '../ApiPreview/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { Props } from './types.js';

const SingletonPageImpl: React.FC<Props> = ({ collection }) => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { getSingletonContent, getFields, createContent, updateContent } = useContent();
  const { data: metaFields } = getFields(collection.collection);
  const fieldFetched = metaFields !== undefined;
  const { data: content } = getSingletonContent(fieldFetched, collection.collection);

  const { trigger: createTrigger, isMutating: isCreateMutating } = createContent(
    collection.collection
  );
  const {
    trigger: updateTrigger,
    isMutating: isUpdateMutating,
    reset,
  } = updateContent(collection.collection, content?.id);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const setDefaultValue = (content: Record<string, any>) => {
    metaFields
      ?.filter((field) => !field.hidden)
      .forEach((field) => {
        setValue(field.field, content[field.field]);
      });
  };

  useEffect(() => {
    if (content === undefined) return;
    setDefaultValue(content);
  }, [content]);

  const onSubmit = async (data: Record<string, any>) => {
    reset();

    try {
      if (content?.id) {
        await updateTrigger(data);
        enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      } else {
        await createTrigger(data);
        enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      }
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{collection.collection}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <ApiPreview slug={collection.collection} singleton={collection.singleton} />
          </Grid>
          <Grid>
            <Button
              variant="contained"
              type="submit"
              disabled={
                !hasPermission(collection.collection, 'update') ||
                isCreateMutating ||
                isUpdateMutating
              }
            >
              {t('update')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container columns={{ xs: 1, lg: 2 }}>
        <Grid xs={1}>
          <Stack rowGap={3}>
            <RenderFields
              control={control}
              register={register}
              errors={errors}
              fields={metaFields || []}
            />
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export const SingletonPage = ComposeWrapper({ context: ContentContextProvider })(SingletonPageImpl);

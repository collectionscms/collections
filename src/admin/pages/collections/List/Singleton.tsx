import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import RenderFields from '../../../components/forms/RenderFields';
import ComposeWrapper from '../../../components/utilities/ComposeWrapper';
import { ContentContextProvider, useContent } from '../../../pages/collections/Context';
import ApiPreview from '../ApiPreview';
import { Props } from './types';

const SingletonPage: React.FC<Props> = ({ collection }) => {
  const [content, setContent] = useState(null);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { getContents, getFields, createContent, updateContent } = useContent();
  const { data: metaFields } = getFields(collection.collection);
  const { data: contents } = getContents(collection.collection);
  const {
    data: createdContent,
    trigger: createTrigger,
    isMutating: isCreateMutating,
  } = createContent(collection.collection);
  const {
    data: updatedContent,
    trigger: updateTrigger,
    isMutating: isUpdateMutating,
    reset,
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
    if (contents?.[0] === undefined) return;
    setContent(contents?.[0]);
    setDefaultValue(contents?.[0]);
  }, [contents]);

  useEffect(() => {
    if (createdContent === undefined) return;
    enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
  }, [createdContent]);

  useEffect(() => {
    if (updatedContent === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
  }, [updatedContent]);

  const onSubmit = (data) => {
    reset();

    if (content?.id) {
      updateTrigger(data);
    } else {
      createTrigger(data);
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
              disabled={isCreateMutating || isUpdateMutating}
            >
              {t('update')}
            </Button>
          </Grid>
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

export default ComposeWrapper({ context: ContentContextProvider })(SingletonPage);

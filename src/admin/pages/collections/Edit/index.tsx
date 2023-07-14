import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { Field } from '../../../../config/types.js';
import { logger } from '../../../../utilities/logger.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { RenderFields } from '../../../components/forms/RenderFields/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { Props } from './types.js';

const EditCollectionPageImpl: React.FC<Props> = ({ collection }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { getContent, getFields, createContent, updateContent } = useContent();
  const { data: metaFields } = getFields(collection.collection, true, { suspense: true });
  const { data: content, trigger: getContentTrigger } = getContent(
    collection.collection,
    id || null
  );
  const { trigger: createTrigger, isMutating: isCreateMutating } = createContent(
    collection.collection
  );
  const { trigger: updateTrigger, isMutating: isUpdateMutating } = updateContent(
    collection.collection,
    content?.id
  );
  const formContext = useForm();
  const { handleSubmit, setValue } = formContext;

  useEffect(() => {
    const getContent = async () => {
      try {
        await getContentTrigger();
      } catch (e) {
        logger.error(e);
      }
    };

    if (id) getContent();
  }, []);

  const setDefaultValue = (fields: Field[]) => {
    fields
      .filter((field) => !field.hidden)
      .forEach((field) => {
        const defaultValue = field.fieldOption?.defaultValue;
        if (defaultValue) {
          setValue(field.field, defaultValue);
        }
      });
  };

  const setContentValue = (fields: Field[], content: Record<string, any>) => {
    fields
      .filter((field) => !field.hidden)
      .forEach((field) => {
        setValue(field.field, content[field.field]);
      });
  };

  useEffect(() => {
    if (metaFields === undefined) return;
    setDefaultValue(metaFields);
  }, [metaFields]);

  useEffect(() => {
    if (metaFields === undefined || content === undefined) return;
    setContentValue(metaFields, content);
  }, [metaFields, content]);

  const navigateToList = () => {
    navigate(`/admin/collections/${collection.collection}`);
  };

  const onSubmit = async (data: Record<string, any>) => {
    try {
      if (id) {
        await updateTrigger(data);
        enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      } else {
        await createTrigger(data);
        enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      }
      navigate(`/admin/collections/${collection.collection}`);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid xs={12} lg={8}>
        <MainCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Stack spacing={1}>
                  <RenderFields form={formContext} fields={metaFields || []} />
                </Stack>
              </Grid>
              <Grid xs={12}>
                {id ? (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: 1 }}
                  >
                    <DeleteButton
                      id={id}
                      slug={`collections/${collection.collection}/contents`}
                      disabled={!hasPermission(collection.collection, 'delete')}
                      onSuccess={navigateToList}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="secondary" onClick={navigateToList}>
                        {t('cancel')}
                      </Button>
                      <Button variant="contained" type="submit" disabled={isUpdateMutating}>
                        {t('update')}
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Grid xs={12}>
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <Button variant="outlined" color="secondary" onClick={navigateToList}>
                        {t('cancel')}
                      </Button>
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={
                          !hasPermission(collection.collection, 'create') || isCreateMutating
                        }
                      >
                        {t('save')}
                      </Button>
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export const EditCollectionPage = ComposeWrapper({ context: ContentContextProvider })(
  EditCollectionPageImpl
);

import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { logger } from '../../../../utilities/logger.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { RenderFields } from '../../../components/forms/RenderFields/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { getCollectionId } from '../../../utilities/getCollectionId.js';
import { ContentContextProvider, useContent } from '../Context/index.js';

const EditCollectionPageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { getContent, getFields, updateContent } = useContent();

  const collectionId = getCollectionId(useLocation().pathname);
  const { data: metaFields } = getFields(collectionId);
  const { data: content } = getContent(collectionId, id);

  const { trigger: updateTrigger, isMutating: isUpdateMutating } = updateContent(
    collectionId,
    content.id
  );

  const formContext = useForm({
    defaultValues: metaFields.reduce(
      (acc, field) => {
        if (content[field.field]) {
          acc[field.field] = content[field.field];
        } else if (field.fieldOption?.defaultValue) {
          acc[field.field] = field.fieldOption?.defaultValue;
        }

        return acc;
      },
      {} as Record<string, any>
    ),
  });

  const navigateToList = () => {
    navigate(`/admin/collections/${collectionId}`);
  };

  const hasSavePermission = hasPermission(collectionId, 'update');

  const onSubmit = async (data: Record<string, any>) => {
    try {
      await updateTrigger(data);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      navigate(`/admin/collections/${collectionId}`);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid xs={12} lg={8}>
        <MainCard>
          <form onSubmit={formContext.handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Stack spacing={1}>
                  <RenderFields form={formContext} fields={metaFields} />
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: 1 }}
                >
                  <DeleteButton
                    id={id}
                    slug={`collections/${collectionId}/contents`}
                    disabled={!hasPermission(collectionId, 'delete')}
                    onSuccess={navigateToList}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color="secondary" onClick={navigateToList}>
                      {t('cancel')}
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!hasSavePermission || isUpdateMutating}
                    >
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
  );
};

export const EditCollectionPage = ComposeWrapper({ context: ContentContextProvider })(
  EditCollectionPageImpl
);

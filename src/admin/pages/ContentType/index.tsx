import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import { Type } from '@admin/components/elements/Table/Cell/types';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import { CollectionContextProvider, useCollection } from '@admin/pages/ContentType/Context';
import buildColumns from '@admin/utilities/buildColumns';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ContentTypePage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const { getCollections } = useCollection();
  const { data } = getCollections();

  const fields = [{ field: 'collection', label: t('name'), type: Type.Text }];

  const columns = buildColumns(fields);

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{localizedLabel}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained" component={RouterLink} to="create">
              {t('create_new')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Table columns={columns} rows={data || []} />
    </Stack>
  );
};

export default ComposeWrapper({ context: CollectionContextProvider })(ContentTypePage);

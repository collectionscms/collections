import { AddOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RouterLink from '../../components/elements/Link';
import Table from '../../components/elements/Table';
import { Type } from '../../components/elements/Table/Cell/types';
import ComposeWrapper from '../../components/utilities/ComposeWrapper';
import { useDocumentInfo } from '../../components/utilities/DocumentInfo';
import { CollectionContextProvider, useCollection } from '../../pages/ContentType/Context';
import buildColumns from '../../utilities/buildColumns';

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
        <Grid container alignItems="center" spacing={3}>
          <Grid>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid>
            <Button
              variant="outlined"
              startIcon={<AddOutlined />}
              component={RouterLink}
              to="create"
            >
              {t('create_new')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Table columns={columns} rows={data} />
    </Stack>
  );
};

export default ComposeWrapper({ context: CollectionContextProvider })(ContentTypePage);

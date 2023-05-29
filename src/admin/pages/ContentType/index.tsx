import { AddOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Collection } from '../../../config/types.js';
import { RouterLink } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { Type } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { useDocumentInfo } from '../../components/utilities/DocumentInfo/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { CollectionContextProvider, useCollection } from './Context/index.js';

const ContentTypePageImpl: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const { getCollections } = useCollection();
  const { data } = getCollections();

  const fields = [{ field: 'collection', label: t('name'), type: Type.Text }];

  const columns = buildColumns(fields, (i: number, row: Collection, data: any) => {
    const cell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;
    return i === 0 ? <RouterLink to={`${row.id}`}>{cell}</RouterLink> : cell;
  });

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
      {data !== undefined && <Table columns={columns} rows={data} />}
    </Stack>
  );
};

export const ContentTypePage = ComposeWrapper({ context: CollectionContextProvider })(
  ContentTypePageImpl
);

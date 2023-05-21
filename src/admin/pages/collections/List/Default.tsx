import { AddOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterLink } from '../../../components/elements/Link/index.js';
import { Cell } from '../../../components/elements/Table/Cell/index.js';
import { Table } from '../../../components/elements/Table/index.js';
import { Column } from '../../../components/elements/Table/types.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../../utilities/buildColumns.js';
import { ApiPreview } from '../ApiPreview/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { buildColumnFields } from './buildColumnFields.js';
import { Props } from './types.js';

const DefaultListPageImpl: React.FC<Props> = ({ collection }) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const { getContents, getFields } = useContent();
  const { data: metaFields } = getFields(collection.collection);
  const fieldFetched = metaFields !== undefined;
  const { data: contents } = getContents(fieldFetched, collection.collection);

  useEffect(() => {
    if (metaFields === undefined) return;
    const columnFields = buildColumnFields(metaFields);
    const columns = buildColumns(columnFields, (i: number, row: any, data: any) => (
      <Cell colIndex={i} type={columnFields[i].type} rowData={row} cellData={data} />
    ));
    setColumns(columns);
  }, [metaFields]);

  return (
    <Stack rowGap={3}>
      <Grid container>
        <Grid xs>
          <Grid container alignItems="center" spacing={3}>
            <Grid>
              <h1>{collection.collection}</h1>
            </Grid>
            {hasPermission(collection.collection, 'create') && (
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
            )}
          </Grid>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <ApiPreview collection={collection.collection} singleton={collection.singleton} />
          </Grid>
        </Grid>
      </Grid>
      {contents !== undefined && <Table columns={columns} rows={contents} />}
    </Stack>
  );
};

export const DefaultListPage = ComposeWrapper({ context: ContentContextProvider })(
  DefaultListPageImpl
);

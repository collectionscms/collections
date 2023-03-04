import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RouterLink from '../../../components/elements/Link';
import Table from '../../../components/elements/Table';
import Cell from '../../../components/elements/Table/Cell';
import { Column } from '../../../components/elements/Table/types';
import { useAuth } from '../../../components/utilities/Auth';
import ComposeWrapper from '../../../components/utilities/ComposeWrapper';
import { ContentContextProvider, useContent } from '../../../pages/collections/Context';
import buildColumns from '../../../utilities/buildColumns';
import ApiPreview from '../ApiPreview';
import buildColumnFields from './buildColumnFields';
import { Props } from './types';

const DefaultListPage: React.FC<Props> = ({ collection }) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const { getContents, getFields } = useContent();
  const { data: metaFields } = getFields(collection.collection);
  const { data: contents } = getContents(collection.collection);

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
              component={RouterLink}
              disabled={!hasPermission(collection.collection, 'create')}
              to="create"
            >
              {t('create_new')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Table columns={columns} rows={contents || []} />
    </Stack>
  );
};

export default ComposeWrapper({ context: ContentContextProvider })(DefaultListPage);

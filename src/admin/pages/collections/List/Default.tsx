import { AddOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RouterLink from '../../../components/elements/Link';
import Table from '../../../components/elements/Table';
import Cell from '../../../components/elements/Table/Cell';
import { Column } from '../../../components/elements/Table/types';
import { useAuth } from '../../../components/utilities/Auth';
import ComposeWrapper from '../../../components/utilities/ComposeWrapper';
import buildColumns from '../../../utilities/buildColumns';
import ApiPreview from '../ApiPreview';
import { ContentContextProvider, useContent } from '../Context';
import buildColumnFields from './buildColumnFields';
import { Props } from './types';

const DefaultListPage: React.FC<Props> = ({ collection }) => {
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
            <ApiPreview slug={collection.collection} singleton={collection.singleton} />
          </Grid>
        </Grid>
      </Grid>
      {contents !== undefined && <Table columns={columns} rows={contents} />}
    </Stack>
  );
};

export default ComposeWrapper({ context: ContentContextProvider })(DefaultListPage);

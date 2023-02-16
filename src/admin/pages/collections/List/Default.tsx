import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { Column } from '@admin/components/elements/Table/types';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { ContentContextProvider, useContent } from '@admin/stores/Content';
import buildColumns from '@admin/utilities/buildColumns';
import { Button, Drawer, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ApiPreview from '../ApiPreview';
import buildColumnFields from './buildColumnFields';
import { Props } from './types';

const DefaultListPage: React.FC<Props> = ({ collection }) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const theme = useTheme();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getContents, getFields } = useContent();
  const { data: metaFields, error: getFieldsError } = getFields(collection.collection);
  const { data: contents, error: getContentsError } = getContents(collection.collection);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  useEffect(() => {
    if (metaFields === undefined) return;
    const columnFields = buildColumnFields(metaFields);
    const columns = buildColumns(columnFields, (i: number, row: any, data: any) => (
      <Cell colIndex={i} type={columnFields[i].type} rowData={row} cellData={data} />
    ));
    setColumns(columns);
  }, [metaFields]);

  useEffect(() => {
    if (getFieldsError === undefined) return;
    enqueueSnackbar(getFieldsError, { variant: 'error' });
  }, [getFieldsError]);

  useEffect(() => {
    if (getContentsError === undefined) return;
    enqueueSnackbar(getContentsError, { variant: 'error' });
  }, [getContentsError]);

  return (
    <Stack rowGap={3}>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <ApiPreview path={collection.collection} />
      </Drawer>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{collection.collection}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained" onClick={toggleDrawer(true)}>
              {t('api_preview')}
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" component={RouterLink} to="create">
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

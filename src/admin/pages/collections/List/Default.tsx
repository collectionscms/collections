import { Stack, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { MainCard } from 'superfast-ui';
import { CreateNewButton } from '../../../components/elements/CreateNewButton/index.js';
import { Link } from '../../../components/elements/Link/index.js';
import { Cell } from '../../../components/elements/Table/Cell/index.js';
import { Table } from '../../../components/elements/Table/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { Collection, GetField } from '../../../config/types.js';
import { buildColumns } from '../../../utilities/buildColumns.js';
import { ApiPreview } from '../ApiPreview/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { buildColumnFields } from './buildColumnFields.js';
import { Props } from './types.js';

const DefaultListPageImpl: React.FC<Props> = ({ collection }) => {
  const { hasPermission } = useAuth();
  const { getContents, getFields } = useContent();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: metaFields } = getFields(collection.collection);
  const { data: contents } = getContents(collection.collection);

  const getColumns = (collection: Collection, metaFields: GetField[]) => {
    const columnFields = buildColumnFields(collection, metaFields);

    const columns = buildColumns(columnFields, (i: number, row: any, data: any) => {
      const cell = <Cell colIndex={i} type={columnFields[i].type} cellData={data} />;
      return i === 0 ? <Link href={`${row.id}`}>{cell}</Link> : cell;
    });

    return columns;
  };
  const columns = getColumns(collection, metaFields);

  return (
    <MainCard
      content={false}
      title={<></>}
      secondary={
        <Stack direction={smDown ? 'column' : 'row'} alignItems="center" spacing={2}>
          <CreateNewButton to="create" disabled={!hasPermission(collection.collection, 'create')} />
          <ApiPreview collection={collection.collection} singleton={collection.singleton} />
        </Stack>
      }
    >
      <Table columns={columns} rows={contents} />
    </MainCard>
  );
};

export const DefaultListPage = ComposeWrapper({ context: ContentContextProvider })(
  DefaultListPageImpl
);

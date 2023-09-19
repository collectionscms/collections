import { Stack, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { CreateNewButton } from '../../../components/elements/CreateNewButton/index.js';
import { Link } from '../../../components/elements/Link/index.js';
import { Cell } from '../../../components/elements/Table/Cell/index.js';
import { Table } from '../../../components/elements/Table/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { Collection, GetField } from '../../../config/types.js';
import { buildColumns } from '../../../utilities/buildColumns.js';
import { getCollectionId } from '../../../utilities/getCollectionId.js';
import { ApiPreview } from '../ApiPreview/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { buildColumnFields } from './buildColumnFields.js';

const ListPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { getContents, getFields, getCollection } = useContent();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const collectionId = getCollectionId(useLocation().pathname);
  const { data: collection } = getCollection(collectionId);
  const { data: metaFields } = getFields(collectionId);
  const { data: contents } = getContents(collectionId);

  const getColumns = (collection: Collection, metaFields: GetField[]) => {
    const columnFields = buildColumnFields(collection, metaFields);

    const columns = buildColumns(columnFields, (i: number, row: any, data: any) => {
      const cell = <Cell colIndex={i} type={columnFields[i].type} cellData={data} />;
      return i === 0 ? <Link href={`contents/${row.id}`}>{cell}</Link> : cell;
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
          <CreateNewButton to="create" disabled={!hasPermission(collectionId, 'create')} />
          <ApiPreview collectionId={collection.id.toString()} singleton={false} />
        </Stack>
      }
    >
      <Table columns={columns} rows={contents} />
    </MainCard>
  );
};

export const ListPage = ComposeWrapper({ context: ContentContextProvider })(ListPageImpl);

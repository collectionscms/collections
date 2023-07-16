import { Stack, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { CreateNewButton } from '../../../components/elements/CreateNewButton/index.js';
import { Cell } from '../../../components/elements/Table/Cell/index.js';
import { Table } from '../../../components/elements/Table/index.js';
import { Column } from '../../../components/elements/Table/types.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../../utilities/buildColumns.js';
import { ApiPreview } from '../ApiPreview/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { buildColumnFields } from './buildColumnFields.js';
import { Props } from './types.js';

const DefaultListPageImpl: React.FC<Props> = ({ collection }) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getContents, getFields } = useContent();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: metaFields } = getFields(collection.collection);
  const fieldFetched = metaFields !== undefined;
  const { data: contents } = getContents(collection.collection, fieldFetched);

  useEffect(() => {
    if (metaFields === undefined) return;
    const columnFields = buildColumnFields(metaFields);

    const columns = buildColumns(columnFields, (i: number, row: any, data: any) => {
      const cell = <Cell colIndex={i} type={columnFields[i].type} cellData={data} />;
      return i === 0 ? <RouterLink to={`${row.id}`}>{cell}</RouterLink> : cell;
    });

    setColumns(columns);
  }, [metaFields]);

  return (
    <MainCard
      content={false}
      title={<></>}
      secondary={
        <Stack direction={smDown ? 'column' : 'row'} alignItems="center" spacing={2}>
          <CreateNewButton to="create" />
          <ApiPreview collection={collection.collection} singleton={collection.singleton} />
        </Stack>
      }
    >
      {contents !== undefined && <Table columns={columns} rows={contents} />}
    </MainCard>
  );
};

export const DefaultListPage = ComposeWrapper({ context: ContentContextProvider })(
  DefaultListPageImpl
);

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
import { Model, GetField } from '../../../config/types.js';
import { buildColumns } from '../../../utilities/buildColumns.js';
import { getModelId } from '../../../utilities/getModelId.js';
import { ApiPreview } from '../ApiPreview/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { buildColumnFields } from './buildColumnFields.js';

const ListPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { getContents, getFields, getModel } = useContent();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const modelId = getModelId(useLocation().pathname);
  const { data: model } = getModel(modelId);
  const { data: metaFields } = getFields(modelId);
  const { data: contents } = getContents(modelId);

  const getColumns = (model: Model, metaFields: GetField[]) => {
    const columnFields = buildColumnFields(model, metaFields);

    const columns = buildColumns(columnFields, (i: number, row: any, data: any) => {
      const cell = <Cell colIndex={i} type={columnFields[i].type} cellData={data} />;
      return i === 0 ? <Link href={`${row.id}`}>{cell}</Link> : cell;
    });

    return columns;
  };
  const columns = getColumns(model, metaFields);

  return (
    <MainCard
      content={false}
      title={<></>}
      secondary={
        <Stack direction={smDown ? 'column' : 'row'} alignItems="center" spacing={2}>
          <CreateNewButton to="create" disabled={!hasPermission(modelId, 'create')} />
          <ApiPreview modelId={model.id.toString()} singleton={false} />
        </Stack>
      }
    >
      <Table columns={columns} rows={contents} />
    </MainCard>
  );
};

export const ListPage = ComposeWrapper({ context: ContentContextProvider })(ListPageImpl);

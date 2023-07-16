import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { Collection } from '../../../config/types.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { Type } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { CollectionContextProvider, useCollection } from './Context/index.js';

const ContentTypePageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getCollections } = useCollection();
  const { data } = getCollections();

  const fields = [{ field: 'collection', label: t('name'), type: Type.Text }];

  const columns = buildColumns(fields, (i: number, row: Collection, data: any) => {
    const cell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;
    return i === 0 ? <RouterLink to={`${row.id}`}>{cell}</RouterLink> : cell;
  });

  return (
    <MainCard content={false} title={<></>} secondary={<CreateNewButton to="create" />}>
      {data !== undefined && <Table columns={columns} rows={data} />}
    </MainCard>
  );
};

export const ContentTypePage = ComposeWrapper({ context: CollectionContextProvider })(
  ContentTypePageImpl
);

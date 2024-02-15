import React from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizedPost } from '../../../types/index.js';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { PostContextProvider, usePost } from './Context/index.js';

export const PostPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getPosts } = usePost();
  const { data: posts } = getPosts();

  const fields = [
    { field: 'title', label: t('title'), type: cells.text() },
    { field: 'status', label: t('status'), type: cells.text() },
    { field: 'locales', label: t('language'), type: cells.array() },
    { field: 'authorName', label: t('author'), type: cells.text() },
    { field: 'updatedAt', label: t('updated_at'), type: cells.date() },
    { field: 'publishedAt', label: t('published_at'), type: cells.date() },
    { field: 'action', label: '', type: cells.text() },
  ];

  const columns = buildColumns(fields, (i: number, row: LocalizedPost, data: any) => {
    const defaultCell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    switch (fields[i].field) {
      case 'title':
        return <Link href={`${row.id}`}>{defaultCell}</Link>;
      default:
        return defaultCell;
    }
  });

  return (
    <>
      <MainCard content={false} title={<></>} secondary={<CreateNewButton to="create" />}>
        <Table columns={columns} rows={posts} />
      </MainCard>
    </>
  );
};

export const PostPage = ComposeWrapper({ context: PostContextProvider })(PostPageImpl);

import { MoreOutlined } from '@ant-design/icons';
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../types/index.js';
import { IconButton } from '../../@extended/components/IconButton/index.js';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { PostContextProvider, usePost } from './Context/index.js';
import { EditMenu } from './Menu/index.js';

export const PostPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPosts, createPost } = usePost();
  const { data: posts, mutate } = getPosts();
  const { trigger } = createPost();

  const [menu, setMenu] = useState<EventTarget | null>(null);
  const [editPost, setEditPost] = useState<LocalizedPost | undefined>();

  const fields = [
    { field: 'title', label: t('title'), type: cells.text() },
    { field: 'status', label: t('status'), type: cells.text() },
    { field: 'locales', label: t('language'), type: cells.array() },
    { field: 'authorName', label: t('author'), type: cells.text() },
    { field: 'updatedAt', label: t('updated_at'), type: cells.date() },
    { field: 'publishedAt', label: t('published_at'), type: cells.date() },
    { field: 'action', label: '', type: cells.text() },
  ];

  const handleDeleteSuccess = () => {
    const deletedPost = posts.filter((post) => post.id !== editPost?.id);
    mutate(deletedPost);
    setMenu(null);
  };

  const handleCreatePost = async () => {
    const post = await trigger();
    navigate(`${post.id}`);
  };

  const handleOpenMenu = (currentTarget: EventTarget, post: LocalizedPost) => {
    setEditPost(post);
    setMenu(currentTarget);
  };

  const columns = buildColumns(fields, (i: number, row: LocalizedPost, data: any) => {
    const defaultCell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    switch (fields[i].field) {
      case 'title':
        return <Link href={`${row.id}`}>{defaultCell}</Link>;
      case 'action':
        return (
          <Stack direction="row" gap={2}>
            <IconButton
              color="secondary"
              size="small"
              onClick={(e) => handleOpenMenu(e.currentTarget, row)}
            >
              <MoreOutlined />
            </IconButton>
          </Stack>
        );
      default:
        return defaultCell;
    }
  });

  return (
    <>
      {editPost && (
        <EditMenu
          id={editPost.id}
          menu={menu}
          onSuccess={handleDeleteSuccess}
          onClose={() => setMenu(null)}
        />
      )}
      <MainCard
        content={false}
        title={<></>}
        secondary={<CreateNewButton onClick={handleCreatePost} />}
      >
        <Table columns={columns} rows={posts} />
      </MainCard>
    </>
  );
};

export const PostPage = ComposeWrapper({ context: PostContextProvider })(PostPageImpl);

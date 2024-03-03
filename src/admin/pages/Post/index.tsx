import { Stack } from '@mui/material';
import { RiMore2Line } from '@remixicon/react';
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
import { RowMenu } from './RowMenu/index.js';
import { enqueueSnackbar } from 'notistack';

export const PostPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPosts, createPost } = usePost();
  const { data: posts, mutate } = getPosts();
  const { trigger } = createPost();

  const [menu, setMenu] = useState<EventTarget | null>(null);
  const [selectedPost, setSelectedPost] = useState<LocalizedPost | undefined>();

  const fields = [
    { field: 'title', label: t('title'), type: cells.text() },
    { field: 'status', label: t('status'), type: cells.text() },
    { field: 'locales', label: t('language'), type: cells.array() },
    { field: 'authorName', label: t('author'), type: cells.text() },
    { field: 'updatedAt', label: t('updated_at'), type: cells.date() },
    { field: 'publishedAt', label: t('published_at'), type: cells.date() },
    { field: 'action', label: '', type: cells.text() },
  ];

  const handleDeleteSuccess = (postId: string) => {
    const deletedPost = posts.filter((post) => post.id !== postId);
    mutate(deletedPost);
    setMenu(null);
    enqueueSnackbar(t('toast.deleted_successfully'), { variant: 'success' });
  };

  const handleArchiveSuccess = (postId: string) => {
    const archivedPost = posts.map((post) => {
      if (post.id == postId) {
        return { ...post, status: 'archived' };
      } else {
        return post;
      }
    });
    mutate(archivedPost);
    setMenu(null);
    enqueueSnackbar(t('toast.archived_successfully'), { variant: 'success' });
  };

  const handleCreatePost = async () => {
    const post = await trigger();
    navigate(`${post.id}`);
  };

  const handleOpenMenu = (currentTarget: EventTarget, post: LocalizedPost) => {
    setSelectedPost(post);
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
              shape="rounded"
              size="small"
              onClick={(e) => handleOpenMenu(e.currentTarget, row)}
            >
              <RiMore2Line />
            </IconButton>
          </Stack>
        );
      default:
        return defaultCell;
    }
  });

  return (
    <>
      {selectedPost && (
        <RowMenu
          postId={selectedPost.id}
          menu={menu}
          onDeleteSuccess={handleDeleteSuccess}
          onArchiveSuccess={handleArchiveSuccess}
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

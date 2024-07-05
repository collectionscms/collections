import { EllipsisOutlined } from '@ant-design/icons';
import { Stack } from '@mui/material';
import Chip from '@mui/material/Chip';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../types/index.js';
import { IconButton } from '../../@extended/components/IconButton/index.js';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { StatusDot } from '../../components/elements/StatusDot/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { PostContextProvider, usePost } from './Context/index.js';
import { RowMenu } from './RowMenu/index.js';

export const PostPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
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
    { field: 'action', label: '', type: cells.text(), width: 80 },
  ];

  const handleTrashSuccess = (postId: string) => {
    const trashedPost = posts.filter((post) => post.id !== postId);
    mutate(trashedPost);
    setMenu(null);
    enqueueSnackbar(t('toast.move_to_trash'), { variant: 'success' });
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

  const handlePublishSuccess = (postId: string) => {
    const publishedPost = posts.map((post) => {
      if (post.id == postId) {
        return { ...post, status: 'published' };
      } else {
        return post;
      }
    });
    mutate(publishedPost);
    setMenu(null);
    enqueueSnackbar(t('toast.published_successfully'), { variant: 'success' });
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
        return (
          <Stack direction="row" alignItems="center">
            {hasPermission('updatePost') ? (
              <Link href={`${row.id}`}>{defaultCell}</Link>
            ) : (
              defaultCell
            )}
            {row.version > 1 && (
              <Chip
                variant="combined"
                color="secondary"
                label={`V${row.version}`}
                size="small"
                sx={{
                  ml: 1,
                  fontSize: '0.725rem',
                  height: 16,
                  '& .MuiChip-label': { px: 0.5 },
                }}
              />
            )}
          </Stack>
        );
      case 'status':
        return row.publishedAt && row.status !== 'published' ? (
          <>
            <StatusDot status="published" />
            <StatusDot status={row.status} />
          </>
        ) : (
          <StatusDot status={row.status} />
        );
      case 'action':
        return (
          <IconButton
            color="secondary"
            shape="rounded"
            size="small"
            onClick={(e) => handleOpenMenu(e.currentTarget, row)}
          >
            <EllipsisOutlined style={{ fontSize: 16 }} />
          </IconButton>
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
          status={selectedPost.status}
          menu={menu}
          onTrashSuccess={handleTrashSuccess}
          onArchiveSuccess={handleArchiveSuccess}
          onPublishSuccess={handlePublishSuccess}
          onClose={() => setMenu(null)}
        />
      )}
      <MainCard
        content={false}
        title={<></>}
        secondary={hasPermission('createPost') && <CreateNewButton onClick={handleCreatePost} />}
      >
        <Table columns={columns} rows={posts} />
      </MainCard>
    </>
  );
};

export const PostPage = ComposeWrapper({ context: PostContextProvider })(PostPageImpl);

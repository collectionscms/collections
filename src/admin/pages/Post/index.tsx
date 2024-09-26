import {
  alpha,
  Box,
  Divider,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { ApiKey } from '@prisma/client';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Cell, Row, TableRowProps } from 'react-table';
import { SourceLanguagePostItem } from '../../../types/index.js';
import { IconButton } from '../../@extended/components/IconButton/index.js';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { ApiPreview } from '../../components/elements/ApiPreview/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Icon } from '../../components/elements/Icon/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { NationalFlagIcon } from '../../components/elements/NationalFlagIcon/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { StatusDot } from '../../components/elements/StatusDot/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { PostContextProvider, usePost } from './Context/index.js';
import { RowMenu } from './RowMenu/index.js';

export const PostPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPosts, createPost, getApiKeys } = usePost();
  const { data: posts, mutate } = getPosts();
  const { trigger: getApiKeyTrigger } = getApiKeys();
  const { trigger } = createPost();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  useEffect(() => {
    const fetchApiKeys = async () => {
      const apiKeys = await getApiKeyTrigger();
      setApiKeys(apiKeys);
    };

    if (hasPermission('readApiKey')) {
      fetchApiKeys();
    }
  }, []);

  const [menu, setMenu] = useState<EventTarget | null>(null);
  const [selectedPost, setSelectedPost] = useState<SourceLanguagePostItem | undefined>();

  const handleTrashSuccess = (postId: string) => {
    const trashedPost = posts.filter((post) => post.postId !== postId);
    mutate(trashedPost);
    setMenu(null);
    enqueueSnackbar(t('toast.move_to_trash'), {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    });
  };

  const handleCreatePost = async () => {
    const post = await trigger();
    navigate(`${post.id}`);
  };

  const handleOpenMenu = (currentTarget: EventTarget, post: SourceLanguagePostItem) => {
    setSelectedPost(post);
    setMenu(currentTarget);
  };

  const columns = useMemo(
    () => [
      {
        id: 'expander',
        width: 40,
        Header: () => null,
        Cell: ({ row }: { row: Row }) => {
          const collapseIcon = row.isExpanded ? (
            <Icon name="ChevronDown" size={20} strokeWidth={2} />
          ) : (
            <Icon name="ChevronRight" size={20} strokeWidth={2} />
          );

          const post = row.original as SourceLanguagePostItem;
          return post.localizedContents?.length > 0 ? (
            <Box
              sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}
              {...row.getToggleRowExpandedProps()}
            >
              {collapseIcon}
            </Box>
          ) : (
            <Box sx={{ opacity: 0.1 }}>{collapseIcon}</Box>
          );
        },
        SubCell: () => null,
      },
      {
        id: 'title',
        Header: t('title'),
        accessor: 'title',
        Cell: ({ row }: { row: Row }) => {
          const post = row.original as SourceLanguagePostItem;
          const title = post.title || t('untitled');
          return hasPermission('updatePost') ? (
            <Link
              href={`${post.postId}?language=${post.language}`}
              sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
            >
              {title}
            </Link>
          ) : (
            <Typography sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{title}</Typography>
          );
        },
      },
      {
        id: 'slug',
        Header: t('slug'),
        accessor: 'slug',
        Cell: ({ value }: { value: string }) => {
          return <Typography>{decodeURI(value)}</Typography>;
        },
      },
      {
        id: 'status',
        Header: `${t('language')} / ${t('status')}`,
        accessor: 'status',
        Cell: ({ row }: { row: Row }) => {
          const post = row.original as SourceLanguagePostItem;
          return (
            <Stack>
              <Stack direction="row" gap={1}>
                <NationalFlagIcon code={post.language} props={{ width: 20, mr: 1 }} />
                {post.status.prevStatus && (
                  <>
                    <StatusDot status="published" isShowText={false} />
                    <Divider orientation="vertical" flexItem variant="middle" />
                  </>
                )}
                <StatusDot status={post.status.currentStatus} />
              </Stack>
              {post.localizedContents?.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {t('other_localized_languages', {
                    count: post.localizedContents.length,
                  })}
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        id: 'updatedAt',
        Header: t('updated_at'),
        accessor: 'updatedAt',
        Cell: ({ value }: { value: Date }) => {
          return <Typography>{dayjs(value).format(t('date_format.long'))}</Typography>;
        },
      },
      {
        id: 'action',
        accessor: 'id',
        width: 40,
        Header: () => null,
        Cell: ({ row }: { row: Row }) => {
          const post = row.original as SourceLanguagePostItem;
          return (
            <IconButton
              color="secondary"
              shape="rounded"
              size="small"
              onClick={(e) => handleOpenMenu(e.currentTarget, post)}
            >
              <Icon name="Ellipsis" size={16} />
            </IconButton>
          );
        },
        SubCell: () => null,
      },
    ],
    []
  );

  const renderRowSubComponent = useCallback(
    ({ row, rowProps }: { row: Row; rowProps: TableRowProps }) => (
      <SubRows row={row} rowProps={rowProps} />
    ),
    []
  );

  return (
    <>
      {selectedPost && (
        <RowMenu
          postId={selectedPost.postId}
          menu={menu}
          onTrashSuccess={handleTrashSuccess}
          onClose={() => setMenu(null)}
        />
      )}
      <MainCard
        content={false}
        title={<></>}
        secondary={
          <Stack direction="row" alignItems="center" spacing={1}>
            <ApiPreview path="posts" apiKeys={apiKeys} />
            {hasPermission('createPost') && <CreateNewButton onClick={handleCreatePost} />}
          </Stack>
        }
      >
        <ScrollX>
          <ReactTable
            columns={columns}
            data={posts}
            renderRowSubComponent={renderRowSubComponent}
          />
        </ScrollX>
      </MainCard>
    </>
  );
};

function SubRows({ row, rowProps }: { row: Row; rowProps: TableRowProps }) {
  const theme = useTheme();

  const post = row.original as SourceLanguagePostItem;

  return (
    <>
      {post.localizedContents.map((localizedContent, i) => (
        <TableRow
          {...rowProps}
          key={`${rowProps.key}-expanded-${i}`}
          sx={{ bgcolor: alpha(theme.palette.primary.lighter, 0.35) }}
        >
          {row.cells.map((cell: Cell<{}, any>) => (
            <TableCell
              {...cell.getCellProps([{ className: cell.column.className }])}
              key={cell.column.id}
            >
              {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
                // @ts-ignore --react-table
                value: cell.column.accessor && cell.column.accessor(localizedContent, i),
                row: { ...row, original: localizedContent },
              })}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export const PostPage = ComposeWrapper({ context: PostContextProvider })(PostPageImpl);

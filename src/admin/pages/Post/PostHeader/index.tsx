import { CloseOutlined, DeleteOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {
  AppBarProps,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { RiEarthLine } from '@remixicon/react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../types/index.js';
import { Avatar } from '../../../@extended/components/Avatar/index.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { BaseDialog } from '../../../components/elements/BaseDialog/index.js';
import { StatusDot } from '../../../components/elements/StatusDot/index.js';
import AppBarStyled from './AppBarStyled.js';

export type Props = {
  post: LocalizedPost;
  currentLocale: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onOpenSettings: () => void;
  onSaveDraft: () => void;
  onChangeLocale: (locale: string) => void;
  onOpenAddLocale: () => void;
  onTrashContent: () => void;
  onTrashPost: () => void;
};

export const PostHeader: React.FC<Props> = ({
  post,
  currentLocale,
  buttonRef,
  onOpenSettings,
  onSaveDraft,
  onChangeLocale,
  onOpenAddLocale,
  onTrashContent,
  onTrashPost,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openContentTrash, setOpenContentTrash] = useState(false);
  const [openPostTrash, setOpenPostTrash] = useState(false);

  const appBar: AppBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: '100%',
    },
  };

  const navigateToList = () => {
    navigate('/admin/posts');
  };

  // /////////////////////////////////////
  // Content Menu
  // /////////////////////////////////////
  const anchorContentRef = useRef<any>(null);
  const [contentMenuOpen, setContentMenuOpen] = useState(false);
  const handleContentMenuOpen = () => {
    setContentMenuOpen((open) => !open);
  };

  const handleCloseContent = (event: MouseEvent | TouchEvent) => {
    if (anchorContentRef.current && anchorContentRef.current.contains(event.target)) {
      return;
    }
    setContentMenuOpen(false);
  };

  const handleTrashContent = () => {
    onTrashContent();
    setOpenContentTrash(false);
    setContentMenuOpen(false);
  };

  const handleTrashPost = () => {
    onTrashPost();
    setOpenPostTrash(false);
    setContentMenuOpen(false);
  };

  // /////////////////////////////////////
  // Locale Menu
  // /////////////////////////////////////
  const anchorRef = useRef<any>(null);
  const [localeOpen, setLocaleOpen] = useState(false);
  const handleLocaleOpen = () => {
    setLocaleOpen((open) => !open);
  };

  const handleCloseLocale = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setLocaleOpen(false);
  };

  const handleChangeLocale = (locale: string) => {
    onChangeLocale(locale);
    setLocaleOpen(false);
  };

  const handleAddLocale = () => {
    onOpenAddLocale();
    setLocaleOpen(false);
  };

  return (
    <>
      <BaseDialog
        open={openContentTrash}
        title={t('dialog.confirm_content_trash_title', {
          locale: t(`locale.${post.contentLocale}` as unknown as TemplateStringsArray),
        })}
        body={t('dialog.confirm_post_trash')}
        confirm={{ label: t('move_to_trash'), action: handleTrashContent }}
        cancel={{ label: t('cancel'), action: () => setOpenContentTrash(false) }}
      />
      <BaseDialog
        open={openPostTrash}
        title={t('dialog.confirm_post_trash_title')}
        body={t('dialog.confirm_post_trash')}
        confirm={{ label: t('move_to_trash'), action: handleTrashPost }}
        cancel={{ label: t('cancel'), action: () => setOpenPostTrash(false) }}
      />
      <AppBarStyled open={true} {...appBar}>
        <Toolbar>
          <Stack direction="row" sx={{ flexGrow: 1 }} gap={2}>
            <Avatar variant="rounded" size="md" color="secondary" type="filled">
              <Typography variant="h5">v{post.version}</Typography>
            </Avatar>
            {post.publishedAt && post.status !== 'published' ? (
              <>
                <StatusDot status="published" />
                <Divider orientation="vertical" flexItem variant="middle" />
                <StatusDot status={post.status} />
              </>
            ) : (
              <StatusDot status={post.status} />
            )}
          </Stack>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Button
              variant="text"
              color="secondary"
              ref={anchorRef}
              startIcon={<RiEarthLine size={22} />}
              onClick={handleLocaleOpen}
            >
              {currentLocale}
            </Button>
            <IconButton
              ref={anchorContentRef}
              color="secondary"
              shape="rounded"
              size="small"
              onClick={handleContentMenuOpen}
            >
              <EllipsisOutlined style={{ fontSize: 20 }} />
            </IconButton>
            <>
              <Tooltip title="⌘ + S" placement="top-start">
                <Button ref={buttonRef} variant="outlined" color="secondary" onClick={onSaveDraft}>
                  {post.status === 'published'
                    ? t('save_draft_new_ver', { version: post.version + 1 })
                    : t('save_draft')}
                </Button>
              </Tooltip>
              <Button variant="contained" onClick={onOpenSettings}>
                {t('publish_settings')}
              </Button>
              <IconButton shape="rounded" color="secondary" onClick={navigateToList}>
                <CloseOutlined style={{ fontSize: 20 }} />
              </IconButton>
            </>
          </Stack>
        </Toolbar>
        {/* Content menu */}
        <Menu
          anchorEl={anchorContentRef.current}
          anchorOrigin={{
            vertical: 35,
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={contentMenuOpen}
          onClose={handleCloseContent}
        >
          {/* Content trash */}
          {post.locales.length > 1 && (
            <MenuItem
              onClick={() => setOpenContentTrash(true)}
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteOutlined />
              <Typography sx={{ pl: 1 }}>
                {t('delete_locale_content', {
                  locale: t(`locale.${post.contentLocale}` as unknown as TemplateStringsArray),
                })}
              </Typography>
            </MenuItem>
          )}
          {/* Post trash */}
          <MenuItem onClick={() => setOpenPostTrash(true)} sx={{ color: theme.palette.error.main }}>
            <DeleteOutlined />
            <Typography sx={{ pl: 1 }}>{t('delete_post')}</Typography>
          </MenuItem>
        </Menu>
        {/* Locale menu */}
        <Menu
          anchorEl={anchorRef.current}
          anchorOrigin={{
            vertical: 35,
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={localeOpen}
          onClose={handleCloseLocale}
        >
          {post.locales.map((locale: string) => (
            <MenuItem
              onClick={() => handleChangeLocale(locale)}
              selected={currentLocale === locale}
              key={locale}
            >
              <Typography sx={{ pl: 1 }}>{locale}</Typography>
            </MenuItem>
          ))}
          <MenuItem onClick={handleAddLocale}>
            <PlusOutlined size={20} />
            <Typography sx={{ pl: 1 }}>{t('add_to')}</Typography>
          </MenuItem>
        </Menu>
      </AppBarStyled>
    </>
  );
};

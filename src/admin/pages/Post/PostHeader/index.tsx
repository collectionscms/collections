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
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../types/index.js';
import { Avatar } from '../../../@extended/components/Avatar/index.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { ModalDialog } from '../../../components/elements/ModalDialog/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { StatusDot } from '../../../components/elements/StatusDot/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import AppBarStyled from './AppBarStyled.js';

export type Props = {
  post: LocalizedPost;
  currentLocale: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onOpenSettings: () => void;
  onSaveDraft: () => void;
  onChangeLocale: (locale: string) => void;
  onOpenAddLocale: () => void;
  onRevertContent: () => void;
  onTrashPost: () => void;
  onTrashLocaleContent: (locale: string) => void;
};

export const PostHeader: React.FC<Props> = ({
  post,
  currentLocale,
  buttonRef,
  onOpenSettings,
  onSaveDraft,
  onChangeLocale,
  onOpenAddLocale,
  onRevertContent,
  onTrashPost,
  onTrashLocaleContent,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [openRevert, setOpenRevert] = useState(false);
  const [openPostTrash, setOpenPostTrash] = useState(false);
  const [openContentTrash, setOpenContentTrash] = useState(false);

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

  const handleRevert = () => {
    onRevertContent();
    setOpenRevert(false);
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

  const handleTrashLocaleContent = () => {
    onTrashLocaleContent(currentLocale);
    setOpenContentTrash(false);
    setContentMenuOpen(false);
  };

  return (
    <>
      <ModalDialog
        open={openRevert}
        title={t('dialog.confirm_revert_previous_version', {
          version: post.version,
        })}
        body={t('dialog.confirm_post_trash')}
        execute={{ label: t('move_to_trash'), action: handleRevert }}
        cancel={{ label: t('cancel'), action: () => setOpenRevert(false) }}
      />
      <ModalDialog
        open={openPostTrash}
        title={t('dialog.confirm_post_trash_title')}
        body={t('dialog.confirm_post_trash')}
        execute={{ label: t('move_to_trash'), action: handleTrashPost }}
        cancel={{ label: t('cancel'), action: () => setOpenPostTrash(false) }}
      />
      <ModalDialog
        open={openContentTrash}
        title={t('dialog.confirm_content_trash_title', {
          locale: t(`locale.${currentLocale}` as unknown as TemplateStringsArray),
        })}
        body={t('dialog.confirm_content_trash')}
        execute={{ label: t('move_to_trash'), action: handleTrashLocaleContent }}
        cancel={{ label: t('cancel'), action: () => setOpenContentTrash(false) }}
      />
      <AppBarStyled open={true} {...appBar}>
        <Toolbar>
          <Stack direction="row" sx={{ flexGrow: 1 }} gap={2}>
            <Avatar variant="rounded" size="md" color="secondary" type="filled">
              <Typography variant="h5">v{post.version}</Typography>
            </Avatar>
            {post.prevStatus && (
              <>
                <StatusDot status="published" />
                <Divider orientation="vertical" flexItem variant="middle" />
              </>
            )}
            <StatusDot status={post.currentStatus} />
          </Stack>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Button variant="text" color="secondary" ref={anchorRef} onClick={handleLocaleOpen}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography>
                  {t(`locale.${currentLocale}` as unknown as TemplateStringsArray)}
                </Typography>
                <Icon name="ChevronDown" size={14} />
              </Stack>
            </Button>
            <IconButton
              ref={anchorContentRef}
              color="secondary"
              shape="rounded"
              size="small"
              onClick={handleContentMenuOpen}
            >
              <Icon name="Ellipsis" size={18} />
            </IconButton>
            <>
              <Tooltip title="⌘ + S" placement="top-start">
                <Button ref={buttonRef} variant="outlined" color="secondary" onClick={onSaveDraft}>
                  {post.currentStatus === 'published'
                    ? t('save_draft_new_ver', { version: post.version + 1 })
                    : t('save_draft')}
                </Button>
              </Tooltip>
              <Button variant="contained" onClick={onOpenSettings}>
                {t('publish_settings')}
              </Button>
              <IconButton shape="rounded" color="secondary" onClick={navigateToList} sx={{ p: 0 }}>
                <Icon name="X" size={28} strokeWidth={1.5} />
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
          {/* Revert previous version */}
          {post.version > 1 && post.currentStatus !== 'published' && (
            <>
              <MenuItem onClick={() => setOpenRevert(true)}>
                <Icon name="Undo2" size={18} />
                <Typography sx={{ pl: 1 }}>{t('revert_previous_version')}</Typography>
              </MenuItem>
              <Divider />
            </>
          )}
          {/* Add localized content */}
          <MenuItem onClick={handleAddLocale}>
            <Icon name="CirclePlus" size={16} />
            <Typography sx={{ pl: 1 }}>{t('add_locale_content')}</Typography>
          </MenuItem>
          {/* Remove localized content */}
          {post.locales.length > 1 && (
            <MenuItem
              onClick={() => setOpenContentTrash(true)}
              sx={{ color: theme.palette.error.main }}
            >
              <Icon name="CircleMinus" size={16} />
              <Typography sx={{ pl: 1 }}>
                {t('remove_locale_content', {
                  locale: t(`locale.${currentLocale}` as unknown as TemplateStringsArray),
                })}
              </Typography>
            </MenuItem>
          )}
          <Divider />
          {/* Delete all content */}
          {hasPermission('trashPost') && (
            <MenuItem
              onClick={() => setOpenPostTrash(true)}
              sx={{ color: theme.palette.error.main }}
            >
              <Icon name="Trash2" size={16} />
              <Typography sx={{ pl: 1 }}>{t('delete_post')}</Typography>
            </MenuItem>
          )}
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
              <Typography>{t(`locale.${locale}` as unknown as TemplateStringsArray)}</Typography>
              <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                ({locale})
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </AppBarStyled>
    </>
  );
};

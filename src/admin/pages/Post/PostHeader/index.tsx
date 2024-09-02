import { LoadingOutlined } from '@ant-design/icons';
import {
  AppBarProps,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../types/index.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { ModalDialog } from '../../../components/elements/ModalDialog/index.js';
import { StatusDot } from '../../../components/elements/StatusDot/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import AppBarStyled from './AppBarStyled.js';
import { History } from './PostHeaderContent/History/index.js';

export type Props = {
  post: LocalizedPost;
  currentLanguage: string;
  isSaving: boolean;
  onOpenSettings: () => void;
  onChangeLanguage: (language: string) => void;
  onOpenAddLanguage: () => void;
  onTrashPost: () => void;
  onTrashLanguageContent: (language: string) => void;
  onReverted: () => void;
};

export const PostHeader: React.FC<Props> = ({
  post,
  currentLanguage,
  isSaving,
  onOpenSettings,
  onChangeLanguage,
  onOpenAddLanguage,
  onTrashPost,
  onTrashLanguageContent,
  onReverted,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
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

  const handleTrashPost = () => {
    onTrashPost();
    setOpenPostTrash(false);
    setContentMenuOpen(false);
  };

  // /////////////////////////////////////
  // Language Menu
  // /////////////////////////////////////

  const anchorRef = useRef<any>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const handleLanguageOpen = () => {
    setLanguageOpen((open) => !open);
  };

  const handleCloseLanguage = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setLanguageOpen(false);
  };

  const handleChangeLanguage = (language: string) => {
    onChangeLanguage(language);
    setLanguageOpen(false);
  };

  const handleAddLanguage = () => {
    onOpenAddLanguage();
    setLanguageOpen(false);
  };

  const handleTrashLanguageContent = () => {
    onTrashLanguageContent(currentLanguage);
    setOpenContentTrash(false);
    setContentMenuOpen(false);
  };

  return (
    <>
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
          language: t(`languages.${currentLanguage}` as unknown as TemplateStringsArray),
        })}
        body={t('dialog.confirm_content_trash')}
        execute={{ label: t('move_to_trash'), action: handleTrashLanguageContent }}
        cancel={{ label: t('cancel'), action: () => setOpenContentTrash(false) }}
      />
      <AppBarStyled open={true} {...appBar}>
        <Toolbar>
          <Stack direction="row" flexGrow={1} gap={2}>
            <IconButton color="secondary" onClick={navigateToList} sx={{ p: 0 }}>
              <Icon name="ArrowLeft" size={28} strokeWidth={1.5} />
            </IconButton>
            <Stack direction="row" gap={1.5}>
              {post.prevStatus && (
                <>
                  <StatusDot status="published" />
                  <Divider orientation="vertical" flexItem variant="middle" />
                </>
              )}
              <StatusDot status={post.currentStatus} />
            </Stack>
            {isSaving && (
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <LoadingOutlined style={{ fontSize: 12, color: theme.palette.secondary.light }} />
                <Typography sx={{ fontSize: 12 }} color="secondary">
                  {t('saving')}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Button variant="text" color="secondary" ref={anchorRef} onClick={handleLanguageOpen}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography>
                  {t(`languages.${currentLanguage}` as unknown as TemplateStringsArray)}
                </Typography>
                <Icon name="ChevronDown" size={14} />
              </Stack>
            </Button>
            <History post={post} onReverted={onReverted} />
            <IconButton ref={anchorContentRef} color="secondary" onClick={handleContentMenuOpen}>
              <Icon name="Ellipsis" size={16} />
            </IconButton>
            <Button variant="contained" onClick={onOpenSettings} sx={{ padding: '5px 15px' }}>
              {t('publish_settings')}
            </Button>
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
          {post.version > 1 && post.currentStatus !== 'published' && <Divider />}
          {/* Remove localized content */}
          {post.usedLanguages.length > 1 && (
            <MenuItem
              onClick={() => setOpenContentTrash(true)}
              sx={{ color: theme.palette.error.main }}
            >
              <Icon name="CircleMinus" size={16} />
              <Typography sx={{ pl: 1 }}>
                {t('remove_language_content', {
                  language: t(`languages.${currentLanguage}` as unknown as TemplateStringsArray),
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
        {/* Language menu */}
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
          open={languageOpen}
          onClose={handleCloseLanguage}
        >
          {post.usedLanguages.map((language: string) => (
            <MenuItem
              onClick={() => handleChangeLanguage(language)}
              selected={currentLanguage === language}
              key={language}
            >
              <Typography>
                {t(`languages.${language}` as unknown as TemplateStringsArray)}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                {language.toUpperCase()}
              </Typography>
            </MenuItem>
          ))}
          {/* Add localized content */}
          <MenuItem onClick={handleAddLanguage}>
            <Icon name="Plus" size={16} />
            <Typography sx={{ pl: 1 }}>{t('add_to')}</Typography>
          </MenuItem>
        </Menu>
      </AppBarStyled>
    </>
  );
};

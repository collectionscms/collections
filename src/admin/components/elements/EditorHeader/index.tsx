import { ArrowLeftOutlined } from '@ant-design/icons';
import { AppBarProps, Button, Stack, Toolbar, Tooltip, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../types/index.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import AppBarStyled from './AppBarStyled.js';

export type Props = {
  post: LocalizedPost;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onOpenSettings: () => void;
  onDraftSave: () => void;
};

export const EditorHeader: React.FC<Props> = ({ post, buttonRef, onOpenSettings, onDraftSave }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <AppBarStyled open={true} {...appBar}>
      <Toolbar>
        <Stack direction="row" sx={{ flexGrow: 1 }} alignItems="center">
          <IconButton shape="rounded" color="secondary" onClick={navigateToList}>
            <ArrowLeftOutlined />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ p: 0.5 }} gap={2}>
          <>
            <Tooltip title="⌘ + S" placement="top-start">
              <Button
                ref={buttonRef}
                variant="outlined"
                size="small"
                color="secondary"
                onClick={onDraftSave}
              >
                {post.status === 'published' ? t('temporary_save') : t('draft_save')}
              </Button>
            </Tooltip>
            <Button variant="contained" size="small" onClick={onOpenSettings}>
              {t('publish_settings')}
            </Button>
          </>
        </Stack>
      </Toolbar>
    </AppBarStyled>
  );
};

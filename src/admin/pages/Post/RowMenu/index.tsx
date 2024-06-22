import { DeleteOutlined, StopOutlined, UploadOutlined } from '@ant-design/icons';
import { Menu, MenuItem, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { BaseDialog } from '../../../components/elements/BaseDialog/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { PostContextProvider, usePost } from '../Context/index.js';

type Props = {
  postId: string;
  status: string;
  menu: any;
  onArchiveSuccess: (postId: string) => void;
  onPublishSuccess: (postId: string) => void;
  onTrashSuccess: (postId: string) => void;
  onClose: () => void;
};

export const RowMenuImpl: React.FC<Props> = (props) => {
  const theme = useTheme();
  const { hasPermission } = useAuth();
  const { postId, status, menu, onTrashSuccess, onClose, onArchiveSuccess, onPublishSuccess } =
    props;
  const [openTrash, setOpenTrash] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);

  const { t } = useTranslation();
  const { changeStatus, trashPost } = usePost();
  const { trigger: changeStatusTrigger } = changeStatus(postId);
  const { trigger: trashTrigger } = trashPost(postId);

  const handleClose = () => {
    setOpenTrash(false);
    setOpenArchive(false);
    onClose();
  };

  // move to trash
  const handleTrash = async () => {
    try {
      await trashTrigger();
      onTrashSuccess(postId);
      setOpenTrash(false);
    } catch (error) {
      logger.error(error);
    }
  };

  // publish to archive
  const handleArchive = async () => {
    try {
      await changeStatusTrigger({
        status: 'archived',
      });
      setOpenArchive(false);
      onArchiveSuccess(postId);
    } catch (error) {
      logger.error(error);
    }
  };

  // archive to publish
  const handlePublish = async () => {
    try {
      await changeStatusTrigger({
        status: 'published',
      });
      onPublishSuccess(postId);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <BaseDialog
        open={openArchive}
        title={t('dialog.confirm_post_archive_title')}
        body={t('dialog.confirm_post_archive')}
        confirm={{ label: t('archive'), action: handleArchive }}
        cancel={{ label: t('cancel'), action: handleClose }}
      />
      <BaseDialog
        open={openTrash}
        title={t('dialog.confirm_post_trash_title')}
        body={t('dialog.confirm_post_trash')}
        confirm={{ label: t('move_to_trash'), action: handleTrash }}
        cancel={{ label: t('cancel'), action: handleClose }}
      />
      <Menu
        anchorEl={menu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(menu)}
        onClose={handleClose}
        sx={{
          zIndex: 1,
        }}
      >
        {status === 'published' && hasPermission('archivePost') && (
          <MenuItem onClick={() => setOpenArchive(true)}>
            <StopOutlined style={{ fontSize: 16, paddingRight: 8 }} />
            <Typography>{t('archive')}</Typography>
          </MenuItem>
        )}
        {status === 'archived' && hasPermission('publishPost') && (
          <MenuItem onClick={handlePublish}>
            <UploadOutlined style={{ fontSize: 16, paddingRight: 8 }} />
            <Typography>{t('publishing')}</Typography>
          </MenuItem>
        )}
        {status !== 'published' && hasPermission('trashPost') && (
          <MenuItem onClick={() => setOpenTrash(true)} sx={{ color: theme.palette.error.main }}>
            <DeleteOutlined style={{ fontSize: 16, paddingRight: 8 }} />
            <Typography>{t('move_to_trash')}</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export const RowMenu = ComposeWrapper({ context: PostContextProvider })(RowMenuImpl);

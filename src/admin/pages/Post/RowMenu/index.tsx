import { DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { RiBookOpenLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { BaseDialog } from '../../../components/elements/BaseDialog/index.js';
import { DeleteDocument } from '../../../components/elements/DeleteDocument/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { PostContextProvider, usePost } from '../Context/index.js';

type Props = {
  postId: string;
  status: string;
  menu: any;
  onDeleteSuccess: (postId: string) => void;
  onArchiveSuccess: (postId: string) => void;
  onPublishSuccess: (postId: string) => void;
  onClose: () => void;
};

export const RowMenuImpl: React.FC<Props> = (props) => {
  const { hasPermission } = useAuth();
  const { postId, status, menu, onDeleteSuccess, onClose, onArchiveSuccess, onPublishSuccess } =
    props;
  const [openDelete, setOpenDelete] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);

  const { t } = useTranslation();
  const { changeStatus } = usePost();
  const { trigger: changeStatusTrigger } = changeStatus(postId);

  const handleClose = () => {
    setOpenDelete(false);
    setOpenArchive(false);
    setOpenPublish(false);
    onClose();
  };

  const handleDeleteSuccess = () => {
    setOpenDelete(false);
    onDeleteSuccess(postId);
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
      setOpenPublish(false);
      onPublishSuccess(postId);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <DeleteDocument
        id={postId}
        slug={'posts'}
        openState={openDelete}
        onSuccess={handleDeleteSuccess}
        onClose={handleClose}
      />
      <BaseDialog
        open={openArchive}
        title={t('dialog.confirm_post_archive_title')}
        body={t('dialog.confirm_post_archive')}
        confirm={{ label: t('archive'), action: handleArchive }}
        cancel={{ label: t('cancel'), action: handleClose }}
      />
      <BaseDialog
        open={openPublish}
        title={t('dialog.confirm_post_publish_title')}
        body={t('dialog.confirm_post_publish')}
        confirm={{ label: t('publish'), action: handlePublish }}
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
        sx={{ zIndex: 1 }}
      >
        {status === 'published' && hasPermission('archivePost') && (
          <MenuItem onClick={() => setOpenArchive(true)}>
            <ListItemIcon>
              <MinusCircleOutlined style={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText>{t('archive')}</ListItemText>
          </MenuItem>
        )}
        {status === 'archived' && hasPermission('publishPost') && (
          <MenuItem onClick={() => setOpenPublish(true)}>
            <ListItemIcon>
              <RiBookOpenLine size={18} />
            </ListItemIcon>
            <ListItemText>{t('publishing')}</ListItemText>
          </MenuItem>
        )}
        {status !== 'published' && hasPermission('deletePost') && (
          <MenuItem onClick={() => setOpenDelete(true)}>
            <ListItemIcon>
              <DeleteOutlined style={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText>{t('delete')}</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export const RowMenu = ComposeWrapper({ context: PostContextProvider })(RowMenuImpl);

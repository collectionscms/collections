import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { RiDeleteBinLine, RiForbid2Line } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { BaseDialog } from '../../../components/elements/BaseDialog/index.js';
import { DeleteDocument } from '../../../components/elements/DeleteDocument/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { PostContextProvider, usePost } from '../Context/index.js';

type Props = {
  postId: string;
  menu: any;
  onDeleteSuccess: (postId: string) => void;
  onArchiveSuccess: (postId: string) => void;
  onClose: () => void;
};

export const RowMenuImpl: React.FC<Props> = (props) => {
  const { postId, menu, onDeleteSuccess, onClose, onArchiveSuccess } = props;
  const [openDelete, setOpenDelete] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const { t } = useTranslation();
  const { changeStatus } = usePost();
  const { trigger: changeStatusTrigger } = changeStatus(postId);

  const handleClose = () => {
    setOpenDelete(false);
    setOpenArchive(false);
    onClose();
  };

  const handleDeleteSuccess = () => {
    setOpenDelete(false);
    onDeleteSuccess(postId);
  };

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
        <MenuItem onClick={() => setOpenArchive(true)}>
          <ListItemIcon>
            <RiForbid2Line size={18} />
          </ListItemIcon>
          <ListItemText> {t('archive')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setOpenDelete(true)}>
          <ListItemIcon>
            <RiDeleteBinLine size={18} />
          </ListItemIcon>
          <ListItemText> {t('delete')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export const RowMenu = ComposeWrapper({ context: PostContextProvider })(RowMenuImpl);

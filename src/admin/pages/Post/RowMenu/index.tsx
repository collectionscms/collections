import { Menu, MenuItem, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { ModalDialog } from '../../../components/elements/ModalDialog/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { PostContextProvider, usePost } from '../Context/index.js';

type Props = {
  postId: string;
  menu: any;
  onTrashSuccess: (postId: string) => void;
  onClose: () => void;
};

export const RowMenuImpl: React.FC<Props> = (props) => {
  const theme = useTheme();
  const { hasPermission } = useAuth();
  const { postId, menu, onTrashSuccess, onClose } = props;
  const [openTrash, setOpenTrash] = useState(false);

  const { t } = useTranslation();
  const { trashPost } = usePost();
  const { trigger: trashTrigger } = trashPost(postId);

  const handleClose = () => {
    setOpenTrash(false);
    onClose();
  };

  // move to trash
  const handleTrash = async () => {
    try {
      await trashTrigger();
      setOpenTrash(false);
      onTrashSuccess(postId);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <ModalDialog
        open={openTrash}
        color="error"
        title={t('dialog.confirm_all_content_trash_title')}
        body={t('dialog.confirm_content_trash')}
        execute={{ label: t('move_to_trash'), action: handleTrash }}
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
        {hasPermission('trashPost') && (
          <MenuItem onClick={() => setOpenTrash(true)} sx={{ color: theme.palette.error.main }}>
            <Icon name="Trash2" size={16} />
            <Typography sx={{ pl: 1 }}>{t('delete_post')}</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export const RowMenu = ComposeWrapper({ context: PostContextProvider })(RowMenuImpl);

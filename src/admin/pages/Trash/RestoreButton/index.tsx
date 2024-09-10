import { Tooltip } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { ModalDialog } from '../../../components/elements/ModalDialog/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { TrashContextProvider, useTrash } from '../Context/index.js';

type Props = {
  postId: string;
  onRestored: () => void;
};

export const RestoreButtonImpl: React.FC<Props> = ({ postId, onRestored }) => {
  const { t } = useTranslation();
  const { restore } = useTrash();
  const { trigger } = restore(postId);
  const [openRestore, setOpenRestore] = useState(false);

  const handleRestore = async () => {
    try {
      await trigger();
      setOpenRestore(false);
      onRestored();
      enqueueSnackbar(t('toast.post_restored'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <ModalDialog
        open={openRestore}
        title={t('dialog.confirm_post_restore_title')}
        body={t('dialog.confirm_post_restore')}
        execute={{ label: t('restore'), action: handleRestore }}
        cancel={{ label: t('cancel'), action: () => setOpenRestore(false) }}
      />
      <Tooltip title={t('restore')}>
        <IconButton
          color="secondary"
          shape="rounded"
          size="small"
          onClick={() => setOpenRestore(true)}
        >
          <Icon name="Undo2" size={16} />
        </IconButton>
      </Tooltip>
    </>
  );
};

export const RestoreButton = ComposeWrapper({ context: TrashContextProvider })(RestoreButtonImpl);

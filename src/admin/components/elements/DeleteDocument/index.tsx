import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { ComposeWrapper } from '../../utilities/ComposeWrapper/index.js';
import { DocumentContextProvider, useDocument } from '../DeleteDocument/Context/index.js';
import { ModalDialog } from '../ModalDialog/index.js';

type Props = {
  id: string;
  slug: string;
  openState: boolean;
  options?: {
    title?: string;
    content?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
};

const DeleteDocumentImpl: React.FC<Props> = ({
  id,
  slug,
  openState,
  options,
  onSuccess,
  onClose,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { deleteDocument } = useDocument();
  const { trigger, reset } = deleteDocument(id, slug);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    try {
      await trigger();
      enqueueSnackbar(t('toast.deleted_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      onSuccess();
      reset();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <ModalDialog
      open={openState}
      title={options?.title ?? t('dialog.confirm_deletion_title')}
      body={options?.content ?? t('dialog.confirm_deletion')}
      execute={{ label: t('delete'), action: handleDelete }}
      cancel={{ label: t('cancel'), action: handleClose }}
      color="error"
    />
  );
};

export const DeleteDocument = ComposeWrapper({ context: DocumentContextProvider })(
  DeleteDocumentImpl
);

import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { ComposeWrapper } from '../../utilities/ComposeWrapper/index.js';
import { DeleteDialog } from '../DeleteDialog/index.js';
import { DocumentContextProvider, useDocument } from '../DeleteDocument/Context/index.js';
import { Props } from './types.js';

const DeleteDocumentImpl: React.FC<Props> = ({ id, slug, openState, onSuccess, onClose }) => {
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
      enqueueSnackbar(t('toast.deleted_successfully'), { variant: 'success' });
      onSuccess();
      reset();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <DeleteDialog
      open={openState}
      title={t('dialog.confirm_deletion_title')}
      body={t('dialog.confirm_deletion')}
      confirm={{ label: t('delete'), action: handleDelete }}
      cancel={{ label: t('cancel'), action: handleClose }}
    />
  );
};

export const DeleteDocument = ComposeWrapper({ context: DocumentContextProvider })(
  DeleteDocumentImpl
);

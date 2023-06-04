import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ComposeWrapper } from '../../utilities/ComposeWrapper/index.js';
import { BaseDialog } from '../BaseDialog/index.js';
import { DocumentContextProvider, useDocument } from '../DeleteDocument/Context/index.js';
import { Props } from './types.js';

const DeleteDocumentImpl: React.FC<Props> = ({ id, slug, openState, onSuccess, onClose }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { deleteDocument } = useDocument();
  const { data, trigger, reset, isMutating } = deleteDocument(id, slug);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    trigger();
  };

  useEffect(() => {
    if (data === undefined) return;
    enqueueSnackbar(t('toast.deleted_successfully'), { variant: 'success' });
    onSuccess();
    reset();
  }, [data]);

  return (
    <BaseDialog
      open={openState}
      title={t('dialog.confirm_deletion_title')}
      body={t('dialog.confirm_deletion')}
      confirm={{ label: t('ok'), action: handleDelete }}
      cancel={{ label: t('cancel'), action: handleClose }}
    />
  );
};

export const DeleteDocument = ComposeWrapper({ context: DocumentContextProvider })(
  DeleteDocumentImpl
);

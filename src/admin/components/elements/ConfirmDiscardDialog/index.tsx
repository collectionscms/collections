import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalDialog } from '../ModalDialog/index.js';
import { Props } from './types.js';

export const ConfirmDiscardDialog: React.FC<Props> = ({ open, onDiscard, onKeepEditing }) => {
  const { t } = useTranslation();

  return (
    <ModalDialog
      open={open}
      title={t('dialog.unsaved_changes_title')}
      body={t('dialog.unsaved_changes')}
      execute={{ action: onKeepEditing, label: t('dialog.keep_editing') }}
      cancel={{ action: onDiscard, label: t('dialog.discard_changes') }}
    />
  );
};

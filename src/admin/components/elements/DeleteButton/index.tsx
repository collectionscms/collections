import { Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { DeleteDocument } from '../DeleteDocument/index.js';
import { Icon } from '../Icon/index.js';

type Props = {
  id: string;
  slug: string;
  disabled?: boolean;
  options?: {
    title?: string;
    content?: string;
  };
  onSuccess: () => void;
};

export const DeleteButton: React.FC<Props> = ({ id, slug, disabled, options, onSuccess }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleOnSuccess = () => {
    onSuccess();
  };

  return (
    <>
      <DeleteDocument
        id={id}
        slug={slug}
        openState={open}
        options={options}
        onSuccess={handleOnSuccess}
        onClose={handleOnClose}
      />
      <Tooltip title={t('delete')} arrow placement="top">
        <span>
          <IconButton color="error" disabled={disabled} onClick={handleClickOpen}>
            <Icon name="Trash2" size={16} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

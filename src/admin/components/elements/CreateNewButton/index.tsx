import { Button, Stack } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../Icon/index.js';

type Props = {
  disabled?: boolean | undefined;
  options?: {
    subject?: string;
  };
  onClick: () => void;
};

export const CreateNewButton: React.FC<Props> = ({ disabled, options, onClick }) => {
  const { t } = useTranslation();

  return (
    <Button variant="contained" size="small" disabled={disabled} onClick={onClick}>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Icon name="Plus" size={14} />
        {options?.subject || t('create_new')}
      </Stack>
    </Button>
  );
};

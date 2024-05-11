import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
    <Button
      variant="contained"
      size="small"
      disabled={disabled}
      startIcon={<PlusOutlined style={{ fontSize: '10px' }} />}
      onClick={onClick}
    >
      {options?.subject || t('create_new')}
    </Button>
  );
};

import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Props } from './types';

export const CreateNewButton: React.FC<Props> = ({ to }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<PlusOutlined style={{ fontSize: '10px' }} />}
      onClick={() => navigate(to)}
    >
      {t('create_new')}
    </Button>
  );
};

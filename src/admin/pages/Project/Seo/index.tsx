import { Box, CardHeader, Divider } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const EditSeo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <CardHeader
        title={t('author_experience_topics')}
        subheader={t('author_experience_topics_description')}
      />
      <Divider />
    </Box>
  );
};

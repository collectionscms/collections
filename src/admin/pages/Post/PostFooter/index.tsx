import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export type Props = {
  characters: number;
};

export const PostFooter: React.FC<Props> = ({ characters }) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        p: 4,
      }}
    >
      <Typography color="secondary">
        <>
          {characters} {t('characters')}
        </>
      </Typography>
    </Box>
  );
};

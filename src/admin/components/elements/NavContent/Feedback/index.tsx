import { ListItemButton, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { feedbackUrl } from '../../../../../constants/externalLinks.js';
import { Icon } from '../../Icon/index.js';

export const Feedback: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const textColor = theme.palette.mode === 'dark' ? 'grey.400' : 'text.primary';
  const iconSelectedColor = theme.palette.mode === 'dark' ? 'text.primary' : 'secondary.main';

  return (
    <ListItemButton
      target="_blank"
      href={feedbackUrl}
      component={'a'}
      sx={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        paddingY: '8px',
        px: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'secondary.lighter',
        },
        '&.Mui-selected': {
          bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'secondary.lighter',
          borderRight: `2px solid ${theme.palette.text.primary}`,
          color: iconSelectedColor,
          '&:hover': {
            color: iconSelectedColor,
            bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'secondary.lighter',
          },
        },
        '&:not(.Mui-selected)': {
          '.MuiTypography-h6': {
            color: textColor,
          },
        },
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap={0.75}>
        <Icon name="Sticker" size={13} />
        <Typography variant="caption">{t('share_your_feedback')}</Typography>
      </Stack>
    </ListItemButton>
  );
};

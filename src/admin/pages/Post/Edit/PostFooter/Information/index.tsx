import { Paper, Stack, Typography, useTheme } from '@mui/material';
import * as Popover from '@radix-ui/react-popover';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../../../@extended/components/IconButton/index.js';
import { Icon } from '../../../../../components/elements/Icon/index.js';

export type Props = {
  characters: number;
};

export const Information: React.FC<Props> = ({ characters }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Popover.Trigger
          asChild
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <IconButton
            color="secondary"
            variant="contained"
            shape="rounded"
            sx={{
              ':focus-visible': {
                outline: 'none',
              },
              color: 'text.primary',
              backgroundColor: theme.palette.grey[200],
              '&:hover': { backgroundColor: theme.palette.grey[300] },
            }}
          >
            <Icon strokeWidth={2} name="Info" />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content side="bottom" align="start" style={{ outline: 'none' }}>
          <Paper
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              padding: 2,
              boxShadow: '0px 9px 24px rgba(0, 0, 0, 0.1)',
              marginBottom: 2,
              width: 200,
            }}
            style={{ outline: 'none' }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              {t('post_info')}
            </Typography>
            <Stack flexDirection="row">
              <Typography sx={{ flexGrow: 1 }}>{t('characters')}</Typography>
              <Typography>{characters}</Typography>
            </Stack>
          </Paper>
        </Popover.Content>
      </Popover.Root>
    </>
  );
};

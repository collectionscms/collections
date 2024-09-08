import { Paper, Stack, Typography } from '@mui/material';
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Popover.Trigger
          asChild
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <IconButton color="secondary" shape="rounded" variant="outlined">
            <Icon strokeWidth={2} name="Info" />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content side="bottom" align="start">
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

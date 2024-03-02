import { List, ListItem, Popover, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export type Props = {
  open: boolean;
  anchor: HTMLButtonElement | null;
  onClose: () => void;
};

export const Guide: React.FC<Props> = ({ open, anchor, onClose }) => {
  const { t } = useTranslation();

  return (
    <Popover
      open={open}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      sx={{ transform: 'translate(0px, -12px)' }}
    >
      <List>
        <ListItem>
          <Typography color="secondary" sx={{ mr: 1 }}>
            ##
          </Typography>
          <Typography>{t('editor.headline')}</Typography>
        </ListItem>
        <ListItem>
          <Typography color="secondary" sx={{ mr: 1 }}>
            ###
          </Typography>
          <Typography>{t('editor.subtitle')}</Typography>
        </ListItem>
        <ListItem>
          <Typography color="secondary" sx={{ mr: 1 }}>
            -
          </Typography>
          <Typography>{t('editor.list')}</Typography>
        </ListItem>
        <ListItem>
          <Typography color="secondary" sx={{ mr: 1 }}>
            1.
          </Typography>
          <Typography>{t('editor.numbered_list')}</Typography>
        </ListItem>
        <ListItem>
          <Typography color="secondary" sx={{ mr: 1 }}>
            &gt;
          </Typography>
          <Typography>{t('editor.quote')}</Typography>
        </ListItem>
        <ListItem>
          <Typography color="secondary" sx={{ mr: 1 }}>
            ⌘ + B
          </Typography>
          <Typography>{t('editor.bold')}</Typography>
        </ListItem>
        <ListItem>
          <Typography color="secondary" sx={{ mr: 1 }}>
            ⌘ + S
          </Typography>
          <Typography>{t('editor.draft_save')}</Typography>
        </ListItem>
      </List>
    </Popover>
  );
};

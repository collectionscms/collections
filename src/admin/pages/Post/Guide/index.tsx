import { List, ListItem, Popover, Tooltip, Typography } from '@mui/material';
import { RiQuestionMark } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../@extended/components/IconButton/index.js';

export const Guide: React.FC = () => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [openEditor, setOpenEditor] = useState(false);

  const handleOpenEditorGuide = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenEditor(true);
  };

  const handleCloseEditorGuide = () => {
    setAnchorEl(null);
    setOpenEditor(false);
  };

  return (
    <>
      <Popover
        open={openEditor}
        anchorEl={anchorEl}
        onClose={handleCloseEditorGuide}
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
      <Tooltip title={t('editor.guide')} placement="top-start">
        <IconButton shape="rounded" color="secondary" onClick={handleOpenEditorGuide}>
          <RiQuestionMark />
        </IconButton>
      </Tooltip>
    </>
  );
};

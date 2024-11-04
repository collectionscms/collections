import { Link, Popover, Stack, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { docsUrl } from '../../../../constants/externalLinks.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { Icon } from '../Icon/index.js';

export const HelpButton = () => {
  const { t } = useTranslation();
  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        shape="rounded"
        variant="contained"
        onClick={toggleMenu}
        ref={anchorRef}
        sx={{ width: 36, height: 36, position: 'fixed', right: 16, bottom: 12, zIndex: 10 }}
      >
        {open ? <Icon name="X" size={16} /> : <Icon name="CircleHelp" size={16} />}
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={toggleMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 50,
          horizontal: 'right',
        }}
      >
        <Stack sx={{ px: 2, py: 1.5 }}>
          <Stack flexDirection="row" alignItems="center" gap={1}>
            <Icon name="Book" size={14} />
            <Link
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ wordBreak: 'break-all' }}
            >
              <Typography variant="body2">{t('documentation')}</Typography>
            </Link>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};

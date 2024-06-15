import {
  AppBarProps,
  Button,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { RiAddLine, RiArrowLeftLine, RiEarthLine } from '@remixicon/react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../types/index.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import AppBarStyled from './AppBarStyled.js';

export type Props = {
  post: LocalizedPost;
  currentLocale: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onOpenSettings: () => void;
  onSaveDraft: () => void;
  onChangeLocale: (locale: string) => void;
  onOpenAddLocale: () => void;
};

export const PostHeader: React.FC<Props> = ({
  post,
  currentLocale,
  buttonRef,
  onOpenSettings,
  onSaveDraft,
  onChangeLocale,
  onOpenAddLocale,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const appBar: AppBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: '100%',
    },
  };

  const navigateToList = () => {
    navigate('/admin/posts');
  };

  // /////////////////////////////////////
  // Locale Menu
  // /////////////////////////////////////
  const anchorRef = useRef<any>(null);
  const [localeOpen, setLocaleOpen] = useState(false);
  const handleLocaleOpen = () => {
    setLocaleOpen((open) => !open);
  };

  const handleCloseLocale = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setLocaleOpen(false);
  };

  const handleChangeLocale = (locale: string) => {
    onChangeLocale(locale);
    setLocaleOpen(false);
  };

  const handleAddLocale = () => {
    onOpenAddLocale();
    setLocaleOpen(false);
  };

  return (
    <AppBarStyled open={true} {...appBar}>
      <Toolbar>
        <Stack direction="row" sx={{ flexGrow: 1 }} alignItems="center">
          <IconButton shape="rounded" color="secondary" onClick={navigateToList}>
            <RiArrowLeftLine />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ p: 0.5 }} gap={2}>
          <Button
            variant="text"
            color="secondary"
            ref={anchorRef}
            startIcon={<RiEarthLine size={22} />}
            onClick={handleLocaleOpen}
          >
            {currentLocale}
          </Button>
          <>
            <Tooltip title="⌘ + S" placement="top-start">
              <Button
                ref={buttonRef}
                variant="outlined"
                size="small"
                color="secondary"
                onClick={onSaveDraft}
              >
                {post.status === 'published' ? t('save_draft_new_ver') : t('save_draft')}
              </Button>
            </Tooltip>
            <Button variant="contained" size="small" onClick={onOpenSettings}>
              {t('publish_settings')}
            </Button>
          </>
        </Stack>
      </Toolbar>
      <Menu
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 35,
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={localeOpen}
        onClose={handleCloseLocale}
      >
        {post.locales.map((locale: string) => (
          <MenuItem
            onClick={() => handleChangeLocale(locale)}
            selected={currentLocale === locale}
            key={locale}
          >
            <Typography sx={{ pl: 1 }}>{locale}</Typography>
          </MenuItem>
        ))}
        <MenuItem onClick={handleAddLocale}>
          <RiAddLine size={20} />
          <Typography sx={{ pl: 1 }}>{t('add_to')}</Typography>
        </MenuItem>
      </Menu>
    </AppBarStyled>
  );
};

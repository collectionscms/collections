import {
  AppBarProps,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../../types/index.js';
import { IconButton } from '../../../../@extended/components/IconButton/index.js';
import { Icon } from '../../../../components/elements/Icon/index.js';
import { NationalFlagIcon } from '../../../../components/elements/NationalFlagIcon/index.js';
import { StatusDot } from '../../../../components/elements/StatusDot/index.js';
import { AppBarStyled } from '../AppBarStyled.js';

export type Props = {
  post: LocalizedPost;
  currentLanguage: string;
  isSaving: boolean;
  onChangeLanguage: (language: string) => void;
  onOpenAddLanguage: () => void;
  onOpenPublishSettings: () => void;
  onReverted: () => void;
};

export const PostHeader: React.FC<Props> = ({
  post,
  currentLanguage,
  isSaving,
  onChangeLanguage,
  onOpenAddLanguage,
  onOpenPublishSettings,
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
  // Language Menu
  // /////////////////////////////////////

  const anchorRef = useRef<any>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const handleLanguageOpen = () => {
    setLanguageOpen((open) => !open);
  };

  const handleCloseLanguage = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setLanguageOpen(false);
  };

  const handleChangeLanguage = (language: string) => {
    onChangeLanguage(language);
    setLanguageOpen(false);
  };

  const handleAddLanguage = () => {
    onOpenAddLanguage();
    setLanguageOpen(false);
  };

  return (
    <>
      <AppBarStyled open={true} {...appBar}>
        <Toolbar>
          <Stack direction="row" flexGrow={1} gap={2}>
            <IconButton color="secondary" onClick={navigateToList} sx={{ p: 0 }}>
              <Icon name="ArrowLeft" size={28} />
            </IconButton>
            <Stack direction="row" gap={1.5}>
              {post.status.prevStatus && (
                <>
                  <StatusDot status="published" />
                  <Divider orientation="vertical" flexItem variant="middle" />
                </>
              )}
              <StatusDot status={post.status.currentStatus} />
            </Stack>
            {isSaving && (
              <Stack flexDirection="row" alignItems="center">
                <Typography sx={{ fontSize: 12 }} color="secondary">
                  {t('saving')}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <Button variant="text" color="secondary" ref={anchorRef} onClick={handleLanguageOpen}>
              <Stack direction="row" alignItems="center" gap={1}>
                <NationalFlagIcon code={currentLanguage} props={{ width: 20 }} />
                <Icon name="ChevronDown" size={14} />
              </Stack>
            </Button>
            <Button
              variant="contained"
              onClick={onOpenPublishSettings}
              sx={{ padding: '5px 15px' }}
            >
              {t('publish_settings')}
            </Button>
          </Stack>
        </Toolbar>
        {/* Language menu */}
        <Menu
          anchorEl={anchorRef.current}
          anchorOrigin={{
            vertical: 35,
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={languageOpen}
          onClose={handleCloseLanguage}
        >
          {post.usedLanguages.map((language: string) => (
            <MenuItem
              onClick={() => handleChangeLanguage(language)}
              selected={currentLanguage === language}
              key={language}
            >
              <NationalFlagIcon code={language} props={{ width: 20, mr: 1 }} />
              <Typography>
                {t(`languages.${language}` as unknown as TemplateStringsArray)}
              </Typography>
            </MenuItem>
          ))}
          {/* Add localized content */}
          <MenuItem onClick={handleAddLanguage}>
            <Icon name="Plus" size={16} />
            <Typography sx={{ pl: 1 }}>{t('add_to')}</Typography>
          </MenuItem>
        </Menu>
      </AppBarStyled>
    </>
  );
};

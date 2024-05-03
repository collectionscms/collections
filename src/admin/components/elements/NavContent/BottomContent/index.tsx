import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Popover,
  Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../../../@extended/components/Avatar/index.js';
import { getLogoutUrl } from '../../../../utilities/urlGenerator.js';

export const BottomContent: React.FC = () => {
  const { t } = useTranslation();

  // Menu
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Menu width
  const [clientWidth, setClientWidth] = useState(0);
  useEffect(() => {
    if (anchorEl) {
      setClientWidth(anchorEl.clientWidth);
    }
  }, [anchorEl]);

  const handleLogout = () => {
    window.location.href = getLogoutUrl();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Stack
          direction="row"
          gap={1}
          sx={{ alignItems: 'center', width: '100%', justifyContent: 'center' }}
        >
          <Avatar size="sm" color="secondary" type="combined">
            <UserOutlined style={{ fontSize: 16 }} />
          </Avatar>
        </Stack>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 0,
          horizontal: 'left',
        }}
      >
        <List sx={{ width: '100%' }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              {t('logout')}
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

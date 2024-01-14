import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Popover,
  Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../../../@extended/components/Avatar/index.js';
import { useAuth } from '../../../utilities/Auth/index.js';

export const BottomContent: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

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
    navigate('/admin/auth/logout');
  };

  return (
    <>
      <Button fullWidth variant="text" color="inherit" onClick={handleMenuOpen}>
        <Stack direction="row" gap={1} sx={{ alignItems: 'center', width: '100%' }}>
          <Avatar size="sm" color="secondary" type="combined">
            <UserOutlined />
          </Avatar>
          {user?.name}
        </Stack>
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 60,
          horizontal: 'center',
        }}
      >
        <List sx={{ width: clientWidth }}>
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

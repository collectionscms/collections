import {
  AccountCircleOutlined,
  AppRegistrationOutlined,
  LogoutOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { Box, Drawer, IconButton, Link, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { config } from '../../../../config/ui.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { BaseDialog } from '../BaseDialog/index.js';
import { RouterLink } from '../Link/index.js';
import { Logo } from '../Logo/index.js';
import { NavGroup } from '../NavGroup/index.js';
import { NavItem } from '../NavItem/index.js';
import Minimal from './minimal.js';
import { Props } from './types.js';

const NavHeader = () => {
  return (
    <Box
      component="header"
      sx={{
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '30px',
          height: '30px',
          color: 'white',
        }}
      >
        <Logo />
      </Box>
    </Box>
  );
};

const NavIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconButton
        sx={{
          width: '44px',
          height: '44px',
        }}
        color="sidebarIcon"
      >
        {children}
      </IconButton>
    </Box>
  );
};

const NavModuleBar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  const modules = [
    {
      href: '/admin/collections',
      icon: (
        <Tooltip title={t('content_management')} placement="right">
          <AppRegistrationOutlined />
        </Tooltip>
      ),
    },
  ];

  const settings = [
    {
      href: '/admin/settings',
      icon: (
        <Tooltip title={t('setting')} placement="right">
          <SettingsOutlined />
        </Tooltip>
      ),
    },
  ];

  const handleLogout = () => {
    setIsDialogOpen(false);
    navigate('/admin/auth/logout');
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        width: '60px',
        bgcolor: 'sidebar.main',
      }}
    >
      <NavHeader />
      <BaseDialog
        open={isDialogOpen}
        title={t('logout')}
        body={t('confirm_logout')}
        confirm={{ label: t('logout'), action: handleLogout }}
        cancel={{ label: t('cancel'), action: handleCancel }}
      />

      {modules.map((module) => (
        <Link component={RouterLink} to={`${module.href}`} key={module.href}>
          <NavIcon>{module.icon}</NavIcon>
        </Link>
      ))}

      {user?.adminAccess ? (
        settings.map((module) => (
          <Link component={RouterLink} to={`${module.href}`} key={module.href}>
            <NavIcon>{module.icon}</NavIcon>
          </Link>
        ))
      ) : (
        <span />
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: '0px',
          width: '60px',
          zIndex: theme.zIndex.appBar + 100,
        }}
      >
        <NavIcon>
          <Tooltip title={t('logout')} placement="right">
            <IconButton onClick={() => setIsDialogOpen(true)}>
              <LogoutOutlined />
            </IconButton>
          </Tooltip>
        </NavIcon>
        <Link component={RouterLink} to="/admin/me">
          <NavIcon>
            <Tooltip title="Me" placement="right">
              <AccountCircleOutlined />
            </Tooltip>
          </NavIcon>
        </Link>
      </Box>
    </Box>
  );
};

const NavContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <NavModuleBar />
      <Box
        sx={{
          alignItems: 'center',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export const Nav: React.FC<Props> = ({ open, group, toggleDrawer }) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (open) {
      toggleDrawer?.();
    }
  }, []);

  const navContent = (
    <NavContent>
      <Box component="nav" sx={{ overflow: 'auto' }}>
        <NavGroup group={group} key={group.label}>
          {group.items.map((item) => (
            <NavItem item={item} key={item.label} />
          ))}
        </NavGroup>
      </Box>
    </NavContent>
  );

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: theme.zIndex.appBar + 200 }}>
      {lgUp ? (
        <Minimal variant="permanent" open={open}>
          {navContent}
        </Minimal>
      ) : (
        <Drawer
          anchor="left"
          onClose={toggleDrawer}
          open={open}
          PaperProps={{
            sx: {
              width: config?.ui.navWidth,
            },
          }}
          sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
          variant="temporary"
        >
          {navContent}
        </Drawer>
      )}
    </Box>
  );
};

import { useAuth } from '@admin/components/utilities/Auth';
import {
  AccountCircleOutlined,
  AppRegistrationOutlined,
  LogoutOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { Box, Drawer, IconButton, Link, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import config from '@shared/features/config';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RouterLink from '../Link';
import Logo from '../Logo';
import NavGroup from '../NavGroup';
import NavItem from '../NavItem';
import Minimal from './minimal';
import { Props } from './types';

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

  const actions = () => {
    return [
      {
        href: '/admin/auth/logout',
        icon: (
          <Tooltip title={t('logout')} placement="right">
            <LogoutOutlined />
          </Tooltip>
        ),
      },
      {
        href: `/admin/me`,
        icon: (
          <Tooltip title="Me" placement="right">
            <AccountCircleOutlined />
          </Tooltip>
        ),
      },
    ];
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
        {actions().map((action) => (
          <Link component={RouterLink} to={`${action.href}`} key={action.href}>
            <NavIcon>{action.icon}</NavIcon>
          </Link>
        ))}
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

const Nav: React.FC<Props> = ({ open, group, toggleDrawer }) => {
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

export default Nav;

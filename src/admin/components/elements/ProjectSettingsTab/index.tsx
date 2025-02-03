import { Box, Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { Icon } from '../Icon/index.js';

export type Props = {
  children?: React.ReactNode;
};

const menus = [
  {
    label: 'general',
    icon: <Icon name="FileText" size={16} classNames={{ marginRight: 8 }} />,
  },
  {
    label: 'seo',
    icon: <Icon name="Search" size={16} classNames={{ marginRight: 8 }} />,
  },
];

export const ProjectSettingsTab: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const [activeTab, setActiveTab] = useState<string>(menus[0].label);

  useEffect(() => {
    let selectedTab = 0;
    switch (pathname) {
      case '/admin/settings/project/seo':
        selectedTab = 1;
        break;
      default:
        selectedTab = 0;
    }

    setActiveTab(menus[selectedTab].label);
  }, [pathname]);

  return (
    <Grid container spacing={2.5}>
      <Grid xs={12} md={10}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
            <Tabs value={activeTab} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              {menus.map((menu: { label: string; icon: React.JSX.Element }, index: number) => (
                <Tab
                  label={t(
                    `project_settings_menu.${menu.label}` as unknown as TemplateStringsArray
                  )}
                  component={Link}
                  to={`/admin/settings/project/${menu.label}`}
                  icon={menu.icon}
                  iconPosition="start"
                  key={index}
                  value={menu.label}
                />
              ))}
            </Tabs>
          </Box>
          <Box sx={{ mt: 2.5 }}>{children}</Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

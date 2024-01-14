import { BugOutlined, LogoutOutlined } from '@ant-design/icons';
import { Box, Divider, Stack, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../../../@extended/components/IconButton/index.js';
import { BaseDialog } from '../../BaseDialog/index.js';

export const BottomContent: React.FC = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Logout
  const handleLogout = () => {
    setLogoutDialogOpen(false);
    navigate('/admin/auth/logout');
  };

  // Bug report
  const handleBugReport = () => {
    window.open('https://github.com/collectionscms/collections/issues/new?template=bug_report.yml');
  };

  return (
    <>
      <BaseDialog
        open={logoutDialogOpen}
        title={t('logout')}
        body={t('confirm_logout')}
        confirm={{ label: t('logout'), action: handleLogout }}
        cancel={{ label: t('cancel'), action: () => setLogoutDialogOpen(false) }}
      />
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
        <Tooltip title={t('report_bug')} arrow>
          <Box sx={{ flexShrink: 0 }}>
            <IconButton
              color="secondary"
              variant="light"
              sx={{ color: 'text.primary' }}
              onClick={handleBugReport}
            >
              <BugOutlined />
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title={t('logout')} arrow>
          <Box sx={{ flexShrink: 0 }}>
            <IconButton
              color="secondary"
              variant="light"
              sx={{ color: 'text.primary' }}
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogoutOutlined />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
    </>
  );
};

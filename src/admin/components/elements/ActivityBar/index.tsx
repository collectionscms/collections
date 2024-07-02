import { PlusOutlined } from '@ant-design/icons';
import { Box, Stack, Tooltip, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { Avatar } from '../../../@extended/components/Avatar/index.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { getAddNewProjectUrl, getUrlForTenant } from '../../../utilities/urlGenerator.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { Link } from '../Link/index.js';
import { BottomContent } from '../NavContent/BottomContent/index.js';
import { t } from 'i18next';

export const ActivityBar: React.FC = () => {
  const theme = useTheme();
  const { currentProjectRole, projects } = useAuth();
  const bottomContent = useMemo(() => <BottomContent />, []);

  return (
    <>
      <Box
        sx={{
          width: 60,
          height: '100vh',
          position: 'relative',
          paddingY: '16px',
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        {projects && (
          <Stack spacing={2}>
            {Object.values(projects).map((project) => (
              <Link
                href={getUrlForTenant(project.subdomain, '/admin')}
                sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
                key={project.id}
              >
                <Tooltip title={project.name} placement="left-start">
                  <Box
                    sx={{ opacity: currentProjectRole?.project.id === project.id ? '1' : '0.5' }}
                  >
                    {project.iconUrl ? (
                      <img src={project.iconUrl} alt={project.name} />
                    ) : (
                      <Avatar
                        size="sm"
                        color="secondary"
                        variant="square"
                        type="filled"
                        sx={{ borderRadius: 1 }}
                      >
                        {project.name[0].toUpperCase()}
                      </Avatar>
                    )}
                  </Box>
                </Tooltip>
              </Link>
            ))}
            {/* new project button */}
            <Link
              href={getAddNewProjectUrl()}
              sx={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              <Tooltip title={t('add_project')} placement="left-start">
                <IconButton color="secondary" variant="text">
                  <PlusOutlined />
                </IconButton>
              </Tooltip>
            </Link>
          </Stack>
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {bottomContent}
        </Box>
      </Box>
    </>
  );
};

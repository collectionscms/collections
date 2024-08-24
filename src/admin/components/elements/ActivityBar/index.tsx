import { Box, Stack, Tooltip, useTheme } from '@mui/material';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { Avatar } from '../../../@extended/components/Avatar/index.js';
import { getAddNewProjectUrl, getUrlForTenant } from '../../../utilities/urlGenerator.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { useColorMode } from '../../utilities/ColorMode/index.js';
import { Icon } from '../Icon/index.js';
import { Link } from '../Link/index.js';
import { BottomContent } from '../NavContent/BottomContent/index.js';

export const ActivityBar: React.FC = () => {
  const theme = useTheme();
  const colorMode = useColorMode();
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
                <Tooltip title={project.name} placement="left">
                  <Box
                    sx={{
                      opacity: currentProjectRole?.project.id === project.id ? 1 : 0.5,
                      transition: 'opacity 0.3s',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    {project.iconUrl ? (
                      <Box
                        component="img"
                        sx={{
                          height: 36,
                          width: 36,
                          objectFit: 'cover',
                          borderRadius: '10px',
                        }}
                        src={project.iconUrl}
                      />
                    ) : (
                      <Avatar
                        size="sm"
                        color="secondary"
                        variant="square"
                        type="filled"
                        sx={{
                          borderRadius: '10px',
                          width: 36,
                          height: 36,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}
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
              color="secondary"
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
              <Tooltip title={t('add_project')} placement="left">
                <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
                  <Icon name="Plus" size={20} />
                </Stack>
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

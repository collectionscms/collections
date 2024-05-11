import { Box, Stack, Tooltip, useTheme } from '@mui/material';
import Avatar from 'boring-avatars';
import React, { useMemo } from 'react';
import { getUrlForTenant } from '../../../utilities/urlGenerator.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { Link } from '../Link/index.js';
import { BottomContent } from '../NavContent/BottomContent/index.js';

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const { me, tenantRole } = useAuth();
  const bottomContent = useMemo(() => <BottomContent />, []);

  return (
    <>
      <Box sx={{ width: 60, height: '100vh', position: 'relative', paddingY: '16px' }}>
        {me && (
          <Stack spacing={2}>
            {Object.values(me.projects).map((project) => (
              <Link
                href={getUrlForTenant(project.subdomain, '/admin')}
                sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                key={project.id}
              >
                <Tooltip title={project.name} placement="left-start">
                  <Box sx={{ opacity: tenantRole?.projectId === project.id ? '1' : '0.5' }}>
                    {project.iconUrl ? (
                      <img src={project.iconUrl} alt={project.name} />
                    ) : (
                      <Avatar size={32} name={project.name} variant="marble" />
                    )}
                  </Box>
                </Tooltip>
              </Link>
            ))}
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

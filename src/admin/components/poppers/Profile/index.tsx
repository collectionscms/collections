import RouterLink from '@admin/components/elements/Link';
import { LogoutOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Fade,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  PopperPlacementType,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

const Profile = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();

  const handleClick =
    (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ],
        }}
        sx={{ zIndex: theme.zIndex.appBar + 100 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              sx={{
                width: 290,
                minWidth: 240,
                maxWidth: 290,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 250,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClickAway}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar
                            alt="profile user"
                            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                            sx={{ width: 32, height: 32 }}
                          />
                          <Stack>
                            <Typography variant="h6">John Doe</Typography>
                            <Typography variant="body2" color="textSecondary">
                              UI/UX Designer
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                  <List component="nav" sx={{ p: 0 }}>
                    <ListItemButton to="/admin/auth/logout" component={RouterLink} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <LogoutOutlined />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Grid container justifyContent="right">
        <Button onClick={handleClick('bottom-end')}>
          <Avatar
            alt="profile user"
            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
            sx={{ width: 32, height: 32 }}
          />
        </Button>
      </Grid>
    </Box>
  );
};

export default Profile;

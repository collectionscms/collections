import { Box, styled, Theme } from '@mui/material';

type Props = {
  theme: Theme;
};

export const NavHeaderStyled = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }: Props) => ({
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 3,
  })
);

import { Box, Theme, alpha, styled } from '@mui/material';
import { MUIStyledCommonProps } from '@mui/system';
import React, { ReactNode } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import SimpleBar, { Props } from 'simplebar-react';

const RootStyle = styled(BrowserView)({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
});

const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[500], 0.48),
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}));

export const ScrollBar = ({ children, sx, ...other }: MUIStyledCommonProps<Theme> & Props) => {
  return (
    <>
      <RootStyle>
        <SimpleBarStyle clickOnTrack={false} sx={sx} {...other}>
          {children as ReactNode}
        </SimpleBarStyle>
      </RootStyle>
      <MobileView>
        <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
          {children as ReactNode}
        </Box>
      </MobileView>
    </>
  );
};

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { styled } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';

const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
  '&.notistack-MuiContent-default': {
    backgroundColor: theme.palette.primary.main,
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.palette.error.main,
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.palette.success.main,
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: theme.palette.info.main,
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: theme.palette.warning.main,
  },
}));

export const Notistack = ({ children }: any) => {
  const iconStyle = { marginRight: 8, fontSize: '1.15rem' };

  return (
    <StyledSnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      iconVariant={{
        success: <CheckCircleOutlined style={iconStyle} />,
        error: <CloseCircleOutlined style={iconStyle} />,
        warning: <WarningOutlined style={iconStyle} />,
        info: <InfoCircleOutlined style={iconStyle} />,
      }}
    >
      {children}
    </StyledSnackbarProvider>
  );
};

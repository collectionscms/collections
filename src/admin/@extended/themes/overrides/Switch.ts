import { Theme } from '@mui/material';
import { SwitchProps } from '@mui/material/Switch';

type SwitchSizeProps = {
  width: number;
  height: number;
  base: number;
  thumb: number;
  trackRadius: number;
};

const getSizeStyle = (size?: SwitchProps['size']): SwitchSizeProps => {
  switch (size) {
    case 'small':
      return { width: 28, height: 16, base: 12, thumb: 10, trackRadius: 8 };
    case 'large':
      return { width: 60, height: 28, base: 32, thumb: 22, trackRadius: 24 };
    case 'medium':
    default:
      return { width: 44, height: 22, base: 22, thumb: 16, trackRadius: 16 };
  }
};

const switchStyle = (theme: Theme, size?: SwitchProps['size']) => {
  const sizes: SwitchSizeProps = getSizeStyle(size);

  return {
    width: sizes.width,
    height: sizes.height,
    '& .MuiSwitch-switchBase': {
      padding: 3,
      '&.Mui-checked': {
        transform: `translateX(${sizes.base}px)`,
      },
    },
    '& .MuiSwitch-thumb': {
      width: sizes.thumb,
      height: sizes.thumb,
    },
    '& .MuiSwitch-track': {
      borderRadius: sizes.trackRadius,
    },
  };
};

export const Switch = (theme: Theme) => {
  return {
    MuiSwitch: {
      styleOverrides: {
        track: {
          opacity: 1,
          backgroundColor: theme.palette.secondary[400],
          boxSizing: 'border-box',
        },
        thumb: {
          borderRadius: '50%',
          transition: theme.transitions.create(['width'], {
            duration: 200,
          }),
        },
        switchBase: {
          '&.Mui-checked': {
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
            },
            '&.Mui-disabled': {
              color: theme.palette.background.paper,
            },
          },
          '&.Mui-disabled': {
            color: theme.palette.background.paper,
            '+.MuiSwitch-track': {
              opacity: 0.3,
            },
          },
        },
        root: {
          color: theme.palette.text.primary,
          padding: 0,
          margin: 8,
          display: 'flex',
          '& ~ .MuiFormControlLabel-label': {
            margin: 6,
          },
          ...switchStyle(theme, 'medium'),
        },
        sizeLarge: { ...switchStyle(theme, 'large') },
        sizeSmall: {
          ...switchStyle(theme, 'small'),
        },
      },
    },
  };
};

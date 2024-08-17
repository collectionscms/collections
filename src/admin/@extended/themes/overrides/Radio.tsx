import { Box, CheckboxProps, Theme } from '@mui/material';
import React from 'react';
import { ExtendedStyleProps } from '../../types/extended.js';
import { getColors } from '../../utilities/getColors.js';

const smallStyle = { size: 16, dotSize: 8, position: 3 };
const mediumStyle = { size: 20, dotSize: 10, position: 4 };

const radioStyle = (size?: CheckboxProps['size']) => {
  const sizes = size === 'small' ? smallStyle : mediumStyle;

  return {
    '& .icon': {
      width: sizes.size,
      height: sizes.size,
      '& .dot': {
        width: sizes.dotSize,
        height: sizes.dotSize,
        top: sizes.position,
        left: sizes.position,
      },
    },
  };
};

const colorStyle = ({ color, theme }: ExtendedStyleProps) => {
  const colors = getColors(theme, color);
  const { lighter, main, dark } = colors;

  return {
    '& .dot': {
      backgroundColor: main,
    },
    '&:hover': {
      backgroundColor: lighter,
    },
    '&.Mui-focusVisible': {
      outline: `2px solid ${dark}`,
      outlineOffset: -4,
    },
  };
};

export const Radio = (theme: Theme) => {
  return {
    MuiRadio: {
      defaultProps: {
        className: 'size-small',
        icon: (
          <Box
            className="icon"
            sx={{
              width: 16,
              height: 16,
              border: '1px solid',
              borderColor: 'inherit',
              borderRadius: '50%',
            }}
          />
        ),
        checkedIcon: (
          <Box
            className="icon"
            sx={{
              width: 16,
              height: 16,
              border: '1px solid',
              borderColor: 'inherit',
              borderRadius: '50%',
              position: 'relative',
            }}
          >
            <Box
              className="dot"
              sx={{
                width: 8,
                height: 8,
                backgroundColor: 'inherit',
                borderRadius: '50%',
                position: 'absolute',
                top: 3,
                left: 3,
              }}
            />
          </Box>
        ),
      },
      styleOverrides: {
        root: {
          color: theme.palette.secondary[300],
          '&.size-small': {
            ...radioStyle('small'),
          },
          '&.size-medium': {
            ...radioStyle('medium'),
          },
        },
        colorPrimary: colorStyle({ color: 'primary', theme }),
        colorSecondary: colorStyle({ color: 'secondary', theme }),
        colorSuccess: colorStyle({ color: 'success', theme }),
        colorWarning: colorStyle({ color: 'warning', theme }),
        colorInfo: colorStyle({ color: 'info', theme }),
        colorError: colorStyle({ color: 'error', theme }),
      },
    },
  };
};

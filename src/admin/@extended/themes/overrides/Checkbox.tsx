import { CheckSquareFilled, MinusSquareFilled } from '@ant-design/icons';
import { Box, CheckboxProps, Theme } from '@mui/material';
import React from 'react';
import { ExtendedStyleProps } from '../../types/extended.js';
import { getColors } from '../../utilities/getColors.js';

const smallStyle = { size: 16, fontSize: 1, position: 1 };
const mediumStyle = { size: 20, fontSize: 1.35, position: 2 };

const checkboxStyle = (size?: CheckboxProps['size']) => {
  const sizes = size === 'small' ? smallStyle : mediumStyle;

  return {
    '& .icon': {
      width: sizes.size,
      height: sizes.size,
      '& .filled': {
        fontSize: `${sizes.fontSize}rem`,
        top: -sizes.position,
        left: -sizes.position,
      },
    },
  };
};

const colorStyle = ({ color, theme }: ExtendedStyleProps) => {
  const colors = getColors(theme, color);
  const { lighter, main, dark } = colors;

  return {
    '&:hover': {
      backgroundColor: lighter,
      '& .icon': {
        borderColor: main,
      },
    },
    '&.Mui-focusVisible': {
      outline: `2px solid ${dark}`,
      outlineOffset: -4,
    },
  };
};

export const Checkbox = (theme: Theme) => {
  return {
    MuiCheckbox: {
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
              borderRadius: 0.25,
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
              borderRadius: 0.25,
              position: 'relative',
            }}
          >
            <CheckSquareFilled className="filled" style={{ position: 'absolute' }} />
          </Box>
        ),
        indeterminateIcon: (
          <Box
            className="icon"
            sx={{
              width: 16,
              height: 16,
              border: '1px solid',
              borderColor: 'inherit',
              borderRadius: 0.25,
              position: 'relative',
            }}
          >
            <MinusSquareFilled className="filled" style={{ position: 'absolute' }} />
          </Box>
        ),
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          color: theme.palette.secondary[300],
          '&.size-small': {
            ...checkboxStyle('small'),
          },
          '&.size-medium': {
            ...checkboxStyle('medium'),
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

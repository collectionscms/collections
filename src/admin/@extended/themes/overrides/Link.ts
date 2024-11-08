export const Link = () => {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          '&.MuiLink-underlineHover': {
            textUnderlineOffset: '3px',
          },
        },
      },
    },
  };
};

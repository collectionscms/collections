export const TableRow = () => {
  return {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-of-type': {
            '& .MuiTableCell-root': {
              borderBottom: 'none',
            },
          },
          '& .MuiTableCell-root': {
            '&:last-of-type': {
              paddingRight: 24,
            },
            '&:first-of-type': {
              paddingLeft: 24,
            },
          },
        },
      },
    },
  };
};

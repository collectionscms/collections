export const TreeItem = () => {
  return {
    MuiTreeItem: {
      styleOverrides: {
        content: {
          padding: 8,
        },
        iconContainer: {
          "& svg": {
            fontSize: "0.625rem",
          },
        },
      },
    },
  };
};

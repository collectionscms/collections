import { CloseCircleOutlined } from '@ant-design/icons';
import { IconButton } from '@collectionscms/plugin-ui';
import { Box, Card, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Props } from './types.js';

export const DropdownChoice: React.FC<Props> = ({ field, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter',
        },
        paddingX: 1,
        cursor: 'pointer',
        height: '44px',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Box
          display="flex"
          alignItems="center"
          onClick={() => onEdit(field)}
          sx={{ flexGrow: 1, height: '100%', alignItems: 'center' }}
        >
          <Typography>{field.label}</Typography>
        </Box>
        <IconButton color="secondary" onClick={() => onDelete(field.id)}>
          <CloseCircleOutlined />
        </IconButton>
      </Box>
    </Card>
  );
};

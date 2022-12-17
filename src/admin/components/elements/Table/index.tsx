import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { Props } from './types';

const Table: React.FC<Props> = ({ columns, rows }) => {
  const key = (row: unknown): String => {
    const data = row as Record<keyof { id: number }, unknown>;
    return data ? data.id.toString() : '';
  };

  return (
    <TableContainer component={Paper}>
      <MuiTable aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={`column-${column.accessor}`}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={`row-${key(row)}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {columns.map((col) => (
                <TableCell key={`cell-${col.accessor}`} component="th" scope="row">
                  {col.renderCell(row, row[col.accessor])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;

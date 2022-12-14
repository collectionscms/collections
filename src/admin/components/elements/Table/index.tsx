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
          {rows.map((row, i) => (
            <TableRow
              key={`row-${row[columns[i].accessor]}`}
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

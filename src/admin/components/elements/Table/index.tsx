import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyTable } from '../../../@extended/components/EmptyTable/index.js';
import { Cell } from './Cell/index.js';
import { Props } from './types.js';

export const Table: React.FC<Props> = ({ columns, rows }) => {
  const { t } = useTranslation();
  const key = (row: unknown): String => {
    const data = row as Record<keyof { id: number }, string>;
    return data?.id || '';
  };

  return (
    <TableContainer>
      <MuiTable aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={`column-${column.field.field}`}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            <>
              {rows.map((row) => (
                <TableRow
                  key={`row-${key(row)}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map((col, i) => (
                    <TableCell key={`cell-${col.field.field}`} component="th" scope="row">
                      {col.customRenderCell ? (
                        col.customRenderCell(i, row, row[col.field.field])
                      ) : (
                        <Cell colIndex={i} type={col.field.type} cellData={row[col.field.field]} />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : (
            <EmptyTable msg={t('no_contents')} colSpan={12} />
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

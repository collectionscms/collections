import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyTable, MainCard } from 'superfast-ui';
import { Cell } from '../Cell/index.js';
import { Props } from './types.js';

export const CheckBoxTable: React.FC<Props> = ({ columns, rows, onChange }) => {
  const { t } = useTranslation();
  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const row = rows.filter((row) => row.id.toString() === e.target.value);
    const checked = e.target.checked;
    onChange(row[0], checked);
  };

  return (
    <MainCard content={false} title={t('content_list')}>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
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
                    key={`row-${row.id}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        onChange={onCheck}
                        value={row.id}
                        inputProps={{
                          'aria-labelledby': `table-checkbox-${row.id}`,
                        }}
                      />
                    </TableCell>
                    {columns.map((col, i) => (
                      <TableCell key={`cell-${col.field.field}`} component="th" scope="row">
                        {col.customRenderCell ? (
                          col.customRenderCell(i, row, row[col.field.field])
                        ) : (
                          <Cell
                            colIndex={i}
                            type={col.field.type}
                            cellData={row[col.field.field]}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                <EmptyTable msg={t('no_contents')} colSpan={12} />
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { FC, Fragment } from 'react';
import { Cell, Column, HeaderGroup, Row, useExpanded, useTable } from 'react-table';

type Props = {
  columns: Column[];
  data: any[];
  renderRowSubComponent: FC<any>;
};

export const ReactTable: React.FC<Props> = ({ columns, data, renderRowSubComponent }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } =
    useTable(
      {
        columns,
        data,
      },
      useExpanded
    );

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup: HeaderGroup, i) => (
          <TableRow {...headerGroup.getHeaderGroupProps()} key={`table-row-${i}`}>
            {headerGroup.headers.map((column: HeaderGroup) => (
              <TableCell key={`table-header-cell-${column.id}`} width={column.width}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row: Row, i) => {
          prepareRow(row);
          const rowProps = row.getRowProps();

          return (
            <Fragment key={`table-body-${i}`}>
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell: Cell<{}>) => (
                  <TableCell key={`table-row-cell-${cell.column.id}`}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
              {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

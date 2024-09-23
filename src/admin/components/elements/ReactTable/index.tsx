import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { FC, Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Column, HeaderGroup, Row, useExpanded, useTable } from 'react-table';
import { EmptyTable } from '../../../@extended/components/EmptyTable/index.js';
import './styles.css';

type Props = {
  columns: Column[];
  data: any[];
  renderRowSubComponent?: FC<any>;
  emptyComponent?: ReactNode;
};

export const ReactTable: React.FC<Props> = ({
  columns,
  data,
  renderRowSubComponent,
  emptyComponent,
}) => {
  const { t } = useTranslation();

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
        {rows.length > 0 ? (
          <>
            {rows.map((row: Row, i) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={`table-body-${i}`}>
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell: Cell<{}>) => (
                      <TableCell
                        className="table-row-cell"
                        key={`table-row-cell-${cell.column.id}`}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded &&
                    renderRowSubComponent &&
                    renderRowSubComponent({ row, rowProps, visibleColumns })}
                </Fragment>
              );
            })}
          </>
        ) : (
          <EmptyTable
            emptyComponent={
              emptyComponent || (
                <Typography align="center" color="secondary">
                  {t('no_contents')}
                </Typography>
              )
            }
            colSpan={columns.length}
          />
        )}
      </TableBody>
    </Table>
  );
};

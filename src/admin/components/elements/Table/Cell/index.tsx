import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { Props, Type } from './types';

const Cell: React.FC<Props> = (props) => {
  const { colIndex, type, rowData, cellData } = props;

  let WrapElement: React.ComponentType<any> | string = 'span';

  const wrapElementProps: {
    to?: string;
  } = {};

  if (colIndex === 0) {
    WrapElement = Link;
    wrapElementProps.to = `${rowData.id}`;
  }

  const sanitizedCellData = () => {
    switch (type) {
      case Type.Text || Type.Number:
        return cellData;
      case Type.Date:
        return format(new Date(String(cellData)), 'yyyy-MM-dd HH:mm');
      case Type.Object:
        return JSON.stringify(cellData);
      default:
        return '';
    }
  };

  return <WrapElement {...wrapElementProps}>{sanitizedCellData()}</WrapElement>;
};

export default Cell;

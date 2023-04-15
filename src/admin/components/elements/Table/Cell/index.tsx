import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { castToBoolean } from '../../../../utilities/castToBoolean';
import RouterLink from '../../Link';
import { Props, Type } from './types';

const Cell: React.FC<Props> = (props) => {
  const { colIndex, type, rowData, cellData } = props;
  const { t } = useTranslation();

  let WrapElement: React.ComponentType<any> | string = 'span';

  const wrapElementProps: {
    to?: string;
  } = {};

  if (colIndex === 0) {
    WrapElement = RouterLink;
    wrapElementProps.to = `${rowData.id}`;
  }

  const sanitizedCellData = () => {
    if (colIndex === 0 && (cellData === null || String(cellData).trim() === '')) {
      return 'No data';
    }

    switch (type) {
      case Type.Text || Type.Number:
        return cellData;
      case Type.Date:
        return format(new Date(String(cellData)), 'yyyy-MM-dd HH:mm');
      case Type.Status:
        // TODO Display icons by status.
        return cellData;
      case Type.Boolean:
        return castToBoolean(cellData) ? t('enabled') : t('disabled');
      case Type.Object:
        return JSON.stringify(cellData);
      default:
        return '';
    }
  };

  return <WrapElement {...wrapElementProps}>{sanitizedCellData()}</WrapElement>;
};

export default Cell;

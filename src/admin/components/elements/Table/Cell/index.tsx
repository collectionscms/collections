import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { castToBoolean } from '../../../../utilities/castToBoolean.js';
import { Props, Type } from './types.js';

export const Cell: React.FC<Props> = (props) => {
  const { colIndex, type, cellData } = props;
  const { t } = useTranslation();
  dayjs.extend(utc);

  const sanitizedCellData: any = () => {
    if (colIndex === 0 && (cellData === null || String(cellData).trim() === '')) {
      return 'No data';
    }

    switch (type) {
      case Type.Text || Type.Number:
        return cellData;
      case Type.Date:
        return dayjs.utc(String(cellData)).local().format('YYYY-MM-DD HH:mm');
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

  return <span>{sanitizedCellData()}</span>;
};

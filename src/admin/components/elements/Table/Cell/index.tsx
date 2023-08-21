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

  const truncate = (value: string) => {
    const MAX_LENGTH = 50;
    return value.length > MAX_LENGTH ? value.substring(0, MAX_LENGTH) + '...' : value;
  };

  const sanitizedCellData: any = () => {
    if (colIndex === 0 && (cellData === null || String(cellData).trim() === '')) {
      return 'No data';
    }

    switch (type) {
      case Type.Text || Type.Number:
        return truncate(String(cellData));
      case Type.Date:
        return dayjs(String(cellData)).local().format('YYYY-MM-DD HH:mm');
      case Type.Status:
        // TODO Display icons by status.
        return cellData;
      case Type.Boolean:
        return castToBoolean(cellData) ? t('enabled') : t('disabled');
      case Type.Object:
        return truncate(JSON.stringify(cellData));
      case Type.Array:
        const data = cellData as Partial<{ id: number }>[];
        const ids = data.map((item) => item.id).join(', ');
        return ids ? '[' + ids + ']' : '';
      default:
        return '';
    }
  };

  return <span>{sanitizedCellData()}</span>;
};

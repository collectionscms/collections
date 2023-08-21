import { CalendarOutlined } from '@ant-design/icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs.js';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker/DateTimePicker.js';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider.js';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'superfast-ui';
import { Props } from '../types.js';

export const DateTimeType: React.FC<Props> = ({
  form: {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  },
  field: meta,
}) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const value = watch(meta.field);

  useEffect(() => {
    if (value === undefined || value === 'Invalid Date') {
      initializeFieldAsNull();
    }
  }, [value]);

  const initializeFieldAsNull = () => {
    setValue(meta.field, null);
  };

  return (
    <Controller
      name={meta.field}
      control={control}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            {...register(meta.field, { ...required })}
            format="YYYY-MM-DD HH:mm"
            ampm={false}
            onChange={(date: Date | null) => {
              field.onChange(dayjs(date).format('YYYY-MM-DD HH:mm'));
            }}
            slots={{
              openPickerButton(ownerState) {
                return (
                  <IconButton disableRipple {...ownerState} color="secondary">
                    <CalendarOutlined />
                  </IconButton>
                );
              },
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                disabled: Boolean(meta.readonly),
                error: errors[meta.field] !== undefined,
                value: field.value ? dayjs(field.value).local() : null,
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

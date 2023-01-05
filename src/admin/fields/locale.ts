import { t } from 'i18next';
import { LocaleObject } from 'yup/lib/locale';
import { MessageParams } from 'yup/lib/types';

const locale: LocaleObject = {
  mixed: {
    default: t('yup.mixed.default'),
    required: t('yup.mixed.required'),
    oneOf: (msg: MessageParams & { values: any }) => t('yup.mixed.one_of', { values: msg.values }),
    notOneOf: (msg: MessageParams & { values: any }) =>
      t('yup.mixed.not_one_of', { label: msg.label, values: msg.values }),
    notType: t('yup.mixed.not_type'),
    defined: t('yup.mixed.defined'),
  },
  string: {
    length: (msg: MessageParams & { length: number }) =>
      t('yup.string.length', { length: msg.length }),
    min: (msg: MessageParams & { min: number }) => t('yup.string.min', { min: msg.min }),
    max: (msg: MessageParams & { max: number }) => t('yup.string.max', { max: msg.max }),
    matches: (msg: MessageParams & { regex: RegExp }) =>
      t('yup.string.matches', { regex: msg.regex }),
    email: t('yup.string.email'),
    url: t('yup.string.url'),
    uuid: t('yup.string.uuid'),
    trim: t('yup.string.trim'),
    lowercase: t('yup.string.lowercase'),
    uppercase: t('yup.string.uppercase'),
  },
  number: {
    min: (msg: MessageParams & { min: number }) => t('yup.number.min', { min: msg.min }),
    max: (msg: MessageParams & { max: number }) => t('yup.number.max', { max: msg.max }),
    lessThan: (msg: MessageParams & { less: number }) =>
      t('yup.number.less_than', { less: msg.less }),
    moreThan: (msg: MessageParams & { more: number }) =>
      t('yup.number.more_than', { more: msg.more }),
    positive: t('yup.number.positive'),
    negative: t('yup.number.negative'),
    integer: t('yup.number.integer'),
  },
  date: {
    min: (msg: MessageParams & { min: Date | string }) => t('yup.date.min', { min: msg.min }),
    max: (msg: MessageParams & { max: Date | string }) => t('yup.date.max', { max: msg.max }),
  },
  object: {
    noUnknown: t('yup.object.no_unknown'),
  },
  array: {
    length: (msg: MessageParams & { length: number }) =>
      t('yup.array.length', { length: msg.length }),
    min: (msg: MessageParams & { min: number }) => t('yup.array.min', { min: msg.min }),
    max: (msg: MessageParams & { max: number }) => t('yup.array.max', { max: msg.max }),
  },
  boolean: {
    isValue: (msg: MessageParams & { value: any }) =>
      t('yup.boolean.is_value', { value: msg.value }),
  },
};

export default locale;

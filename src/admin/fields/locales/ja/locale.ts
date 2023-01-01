import { values } from 'lodash';
import { LocaleObject } from 'yup/lib/locale';
import { MessageParams } from 'yup/lib/types';

const locale: LocaleObject = {
  mixed: {
    default: '入力エラーです',
    required: '入力してください',
    oneOf: (msg: MessageParams & { values: any }) =>
      `次の値のいずれかを入力してください: ${msg.values}`,
    notOneOf: (msg: MessageParams & { values: any }) =>
      `${msg.label}は、次の値のいずれかは入力できません: ${values}`,
    notType: '正しい形式で入力してください',
    defined: '定義されていません',
  },
  string: {
    length: (msg: MessageParams & { length: number }) => `${msg.length}文字で入力してください`,
    min: (msg: MessageParams & { min: number }) => `${msg.min}文字以上で入力してください`,
    max: (msg: MessageParams & { max: number }) => `最大${msg.max}文字以内で入力してください`,
    matches: (msg: MessageParams & { regex: RegExp }) =>
      `次と一致する値を入力してください: "${msg.regex}"`,
    email: 'メールアドレス形式で入力してください',
    url: '有効なURLを入力してください',
    uuid: '有効なUUIDを入力してください',
    trim: 'トリミングされた値を入力してください',
    lowercase: '小文字の値を入力してください',
    uppercase: '大文字の値を入力してください',
  },
  number: {
    min: (msg: MessageParams & { min: number }) => `${msg.min}以上を入力してください`,
    max: (msg: MessageParams & { max: number }) => `${msg.max}以下で入力してください`,
    lessThan: (msg: MessageParams & { less: number }) =>
      `${msg.less}より小さい値を入力してください`,
    moreThan: (msg: MessageParams & { more: number }) =>
      `${msg.more}より大きい値を入力してください`,
    positive: '0以上の値を入力してください',
    negative: '0より小さい値を入力してください',
    integer: '整数で入力してください',
  },
  date: {
    min: (msg: MessageParams & { min: Date | string }) =>
      `${msg.min}より未来の値を入力してください`,
    max: (msg: MessageParams & { max: Date | string }) =>
      `${msg.max}より過去の値を入力してください`,
  },
  object: {
    noUnknown: 'オブジェクトシェイプで指定されていないキーを含めることはできません',
  },
  array: {
    length: (msg: MessageParams & { length: number }) => `${msg.length}の項目数が必要です`,
    min: (msg: MessageParams & { min: number }) => `少なくとも${msg.min}の項目が必要です`,
    max: (msg: MessageParams & { max: number }) => `${msg.max}以下の項目が必要です`,
  },
  boolean: {
    isValue: (msg: MessageParams) => `${msg.label}でなければなりません`,
  },
};

export default locale;

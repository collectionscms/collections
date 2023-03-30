import input from './Input';
import inputMultiline from './InputMultiline';
import selectDropdown from './SelectDropdown';
import { Props } from './types';

export type FieldTypes = {
  input: React.ComponentType<Props>;
  inputMultiline: React.ComponentType<Props>;
  selectDropdown: React.ComponentType<Props>;
};

const fieldTypes: FieldTypes = {
  input,
  inputMultiline,
  selectDropdown,
};

export default fieldTypes;

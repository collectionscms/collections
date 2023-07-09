import { Collection } from '../../../../config/types.js';

export type ConfigContext = {
  permittedCollections: Collection[];
};

export type Props = {
  children?: React.ReactNode;
};

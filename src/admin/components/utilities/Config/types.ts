import { Collection } from '../../../config/types.js';

export type ConfigContext = {
  permittedCollections: Collection[];
  revalidateCollections: () => void;
};

export type Props = {
  children?: React.ReactNode;
};

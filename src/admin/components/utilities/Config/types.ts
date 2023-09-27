import { Model } from '../../../config/types.js';

export type ConfigContext = {
  permittedModels: Model[];
  revalidateModels: () => void;
};

export type Props = {
  children?: React.ReactNode;
};

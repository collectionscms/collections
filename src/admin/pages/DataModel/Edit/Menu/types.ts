export type Props = {
  id: string;
  modelId: string;
  menu: any;
  deletable: boolean;
  onEdit: () => void;
  onSuccess: () => void;
  onClose: () => void;
};

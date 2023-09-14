export type Props = {
  collectionId: string;
  field: string;
  openState: boolean;
  onSuccess: (content: Partial<{ id: number }>) => void;
  onClose: () => void;
};

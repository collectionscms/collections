import { LoadingButtonProps } from '@mui/lab';
import { ButtonProps, ChipProps, IconButtonProps, SliderProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

type TooltipColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'default';

export type ColorProps =
  | ChipProps['color']
  | ButtonProps['color']
  | LoadingButtonProps['color']
  | IconButtonProps['color']
  | SliderProps['color']
  | TooltipColor;

export type ExtendedStyleProps = {
  color: ColorProps;
  theme: Theme;
};

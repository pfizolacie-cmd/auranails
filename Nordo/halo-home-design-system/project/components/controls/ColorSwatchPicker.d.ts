export interface ColorSwatchPickerProps {
  /** CSS colours — defaults to the six bulb tokens. */
  colors?: string[];
  value?: string;
  onChange?: (color: string) => void;
  /** Unselected dot size. Selected grows +10px and gains a halo. */
  size?: number;
  style?: React.CSSProperties;
}
export declare function ColorSwatchPicker(props: ColorSwatchPickerProps): JSX.Element;

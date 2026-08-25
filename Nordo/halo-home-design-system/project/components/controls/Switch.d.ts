export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  size?: 'sm' | 'md';
  label: string;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;

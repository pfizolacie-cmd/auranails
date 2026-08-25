export interface StepperButtonProps {
  direction?: 'up' | 'down';
  onClick?: () => void;
  size?: number;
  label?: string;
  style?: React.CSSProperties;
}
export declare function StepperButton(props: StepperButtonProps): JSX.Element;

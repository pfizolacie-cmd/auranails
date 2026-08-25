/**
 * Pill button.
 * @startingPoint section="Controls" subtitle="Ember, glass, porcelain and ghost pill buttons" viewport="700x150"
 */
export interface ButtonProps {
  variant?: 'primary' | 'glass' | 'solid' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide slug rendered before the label. */
  icon?: string;
  full?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;

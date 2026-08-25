export interface IconButtonProps {
  /** Lucide slug. */
  icon: string;
  /** Diameter in px. Default 40. Never go below 44 for primary touch targets. */
  size?: number;
  tone?: 'glass' | 'solid' | 'ember';
  /** Lit state — glyph turns glow-yellow and gains a halo. */
  active?: boolean;
  label: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;

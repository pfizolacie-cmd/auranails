export interface IconProps {
  /** Lucide icon slug, e.g. "house", "lightbulb", "thermometer", "settings". */
  name: string;
  /** Box size in px. Default 20. */
  size?: number;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;

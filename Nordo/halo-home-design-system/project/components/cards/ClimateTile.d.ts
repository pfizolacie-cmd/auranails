export interface ClimateTileProps {
  value?: number;
  unit?: string;
  label?: string;
  on?: boolean;
  onToggle?: () => void;
  style?: React.CSSProperties;
}
export declare function ClimateTile(props: ClimateTileProps): JSX.Element;

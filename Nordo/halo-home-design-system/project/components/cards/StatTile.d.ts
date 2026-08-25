export interface StatTileProps {
  icon: string;
  label: string;
  /** Secondary line — network name, reading, device code. */
  value?: string;
  meta?: string;
  tone?: 'light' | 'dim' | 'solid';
  style?: React.CSSProperties;
}
export declare function StatTile(props: StatTileProps): JSX.Element;

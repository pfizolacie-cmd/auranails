export interface MediaCardProps {
  title: string;
  artist?: string;
  /** Album / room art thumbnail. */
  art?: string;
  playing?: boolean;
  liked?: boolean;
  /** Listener count shown at the end of the transport row. */
  count?: number;
  onToggle?: () => void;
  style?: React.CSSProperties;
}
export declare function MediaCard(props: MediaCardProps): JSX.Element;

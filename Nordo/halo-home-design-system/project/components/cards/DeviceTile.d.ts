/**
 * Photo-backed device tile for the home grid.
 * @startingPoint section="Cards" subtitle="Device tile with photo, status and power dot" viewport="700x260"
 */
export interface DeviceTileProps {
  name: string;
  status?: string;
  /** Background photo of the device in situ. */
  image?: string;
  on?: boolean;
  onToggle?: () => void;
  height?: number;
  style?: React.CSSProperties;
}
export declare function DeviceTile(props: DeviceTileProps): JSX.Element;

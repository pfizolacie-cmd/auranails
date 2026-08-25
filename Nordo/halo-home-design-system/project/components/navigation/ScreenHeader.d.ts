export interface ScreenHeaderProps {
  onBack?: () => void;
  /** Used when there is no back affordance — e.g. the menu button. */
  left?: React.ReactNode;
  /** Usually a SegmentedControl. */
  center?: React.ReactNode;
  right?: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: React.CSSProperties;
}
export declare function ScreenHeader(props: ScreenHeaderProps): JSX.Element;

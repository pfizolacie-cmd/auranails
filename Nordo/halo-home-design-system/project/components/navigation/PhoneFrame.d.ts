export interface PhoneFrameProps {
  /** Room photo behind the glass — the whole aesthetic depends on it. */
  backdrop: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PhoneFrame(props: PhoneFrameProps): JSX.Element;

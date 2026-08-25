export interface AlarmCardProps {
  title?: string;
  time?: string;
  meta?: string;
  on?: boolean;
  onToggle?: (next: boolean) => void;
  style?: React.CSSProperties;
}
export declare function AlarmCard(props: AlarmCardProps): JSX.Element;

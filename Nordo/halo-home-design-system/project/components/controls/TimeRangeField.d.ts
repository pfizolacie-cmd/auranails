export interface TimeRangeFieldProps {
  from?: string;
  to?: string;
  separator?: string;
  onChange?: (which: 'from' | 'to') => void;
  style?: React.CSSProperties;
}
export declare function TimeRangeField(props: TimeRangeFieldProps): JSX.Element;

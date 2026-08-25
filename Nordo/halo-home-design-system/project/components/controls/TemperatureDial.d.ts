/**
 * Radial climate gauge with a porcelain centre puck.
 * @startingPoint section="Controls" subtitle="Climate gauge, cool-to-ember sweep" viewport="700x300"
 */
export interface TemperatureDialProps {
  value?: number;
  min?: number;
  max?: number;
  /** Current ambient reading, drawn as a cool marker on the track. */
  now?: number;
  size?: number;
  label?: string;
  unit?: string;
  style?: React.CSSProperties;
}
export declare function TemperatureDial(props: TemperatureDialProps): JSX.Element;

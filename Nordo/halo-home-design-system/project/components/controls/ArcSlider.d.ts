/**
 * Half-dome brightness arc with the value read out inside it.
 * @startingPoint section="Controls" subtitle="Brightness arc with centred metric readout" viewport="700x300"
 */
export interface ArcSliderProps {
  /** 0–100. */
  value?: number;
  onChange?: (value: number) => void;
  /** Outer diameter in px. Default 240. */
  size?: number;
  unit?: string;
  caption?: string;
  style?: React.CSSProperties;
}
export declare function ArcSlider(props: ArcSliderProps): JSX.Element;

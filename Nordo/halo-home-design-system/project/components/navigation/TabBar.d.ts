/**
 * Floating glass tab bar.
 * @startingPoint section="Navigation" subtitle="Floating glass tab bar with a lit active glyph" viewport="700x150"
 */
export interface TabBarProps {
  items: Array<{ value: string; icon: string; label: string }>;
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function TabBar(props: TabBarProps): JSX.Element;

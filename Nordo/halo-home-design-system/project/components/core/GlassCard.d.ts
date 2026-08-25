/**
 * Frosted panel — the base surface of every Halo Home screen.
 * @startingPoint section="Surfaces" subtitle="Frosted glass panel over a warm room backdrop" viewport="700x260"
 */
export interface GlassCardProps {
  /** "light" frosted (default), "dim" smoked, "solid" porcelain card. */
  tone?: 'light' | 'dim' | 'solid';
  padding?: string;
  radius?: string;
  /** Add the warm halo shadow — reserve for an actively-emitting device. */
  glow?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function GlassCard(props: GlassCardProps): JSX.Element;

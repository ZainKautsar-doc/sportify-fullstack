/**
 * Sportify SVG logo wrapper.
 *
 * The original SVG uses hardcoded fill colors (#17238d, #001450, #000000).
 * We render it inline and use a CSS `filter` trick to shift it to either:
 *   - "color"  → original navy from the file (invert→sepia→hue→saturate)
 *   - "white"  → fully white (brightness high)
 *   - "navy"   → original (no filter)
 *
 * For maximum fidelity the SVG paths are inlined directly.
 */

interface SportifyLogoProps {
  /** Display height & width in px */
  size?: number;
  /** Color variant */
  variant?: 'color' | 'white';
  className?: string;
}

export default function SportifyLogo({
  size = 36,
  variant = 'color',
  className = '',
}: SportifyLogoProps) {
  /**
   * The SVG has 2 geometric shapes and a football:
   *   - parallelogram / rhombus shapes: #17238d (navy-ish blue)
   *   - shadow shapes: #001450 (dark navy)
   *   - football: #000000 (black)
   *
   * When variant="white", we apply a CSS filter to turn all dark fills white.
   * When variant="color", we keep the original SVG colors (navy).
   */
  const filterStyle =
    variant === 'white'
      ? {
          // invert all dark colors → white
          filter:
            'brightness(0) invert(1)',
        }
      : {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1500 1500"
      width={size}
      height={size}
      className={className}
      aria-label="Sportify logo"
      style={{ ...filterStyle, flexShrink: 0 }}
    >
      {/* ── Football / ball shape ── */}
      <g clipPath="url(#sp-ball-clip)">
        <clipPath id="sp-ball-clip">
          <path d="M 484.47 354.14 L 677.22 354.14 L 677.22 545.39 L 484.47 545.39 Z" clipRule="nonzero" />
        </clipPath>
        <path
          fill="#000000"
          fillOpacity="1"
          fillRule="nonzero"
          d="M 676.96 442.93 C 676.28 434.03 674.41 425.37 671.71 416.92 C 668.21 405.95 662.44 396.25 654.68 387.69 C 649.99 382.52 645.16 377.5 639.81 373.02 C 634.18 368.3 627.53 365.11 620.93 362.02 C 612.2 357.94 602.9 355.9 593.3 354.85 C 583.35 353.75 573.51 353.8 563.72 355.84 C 552.14 358.25 541.25 362.3 530.81 368.03 C 516.88 375.67 506.37 386.8 498.04 399.82 C 488.75 414.33 485.17 430.84 484.52 447.97 C 484.32 454.74 485.14 461.41 486.34 468.04 C 489.66 486.59 498.62 502.33 511.01 516.15 C 517.52 523.41 525.95 528.45 534.36 533.29 C 546.45 540.25 559.52 544.03 573.44 545.1 C 581.79 545.74 590.07 545.3 598.22 543.74 C 614.35 540.66 629.05 534.17 641.91 523.83 C 650.84 516.66 658.75 508.49 664.35 498.39 C 669.74 488.66 673.62 478.36 675.52 467.33 C 676.92 459.23 677.6 451.15 676.96 442.93 Z"
        />
      </g>

      {/* ── Upper parallelogram (bright navy) ── */}
      <g clipPath="url(#sp-upper-clip)">
        <clipPath id="sp-upper-clip">
          <path d="M 227 150 L 1473.66 150 L 1473.66 469 L 227 469 Z" clipRule="nonzero" />
        </clipPath>
        <path
          fill="#17238d"
          fillOpacity="1"
          fillRule="evenodd"
          d="M 463.33 150 L 1473.45 150 L 1237.77 468.89 L 227.63 468.89 Z"
        />
      </g>

      {/* ── Upper shadow triangle (dark navy) ── */}
      <path
        fill="#001450"
        fillOpacity="1"
        fillRule="evenodd"
        d="M 227.63 468.89 L 732.7 468.89 L 477.11 813.21 L 255.19 507.04 Z"
      />

      {/* ── Lower parallelogram (bright navy) ── */}
      <g clipPath="url(#sp-lower-clip)">
        <clipPath id="sp-lower-clip">
          <path d="M 26.16 985 L 1273 985 L 1273 1304.25 L 26.16 1304.25 Z" clipRule="nonzero" />
        </clipPath>
        <path
          fill="#17238d"
          fillOpacity="1"
          fillRule="evenodd"
          d="M 1036.76 1304.52 L 26.63 1304.52 L 262.84 985.63 L 1272.96 985.63 Z"
        />
      </g>

      {/* ── Lower shadow triangle (dark navy) ── */}
      <path
        fill="#001450"
        fillOpacity="1"
        fillRule="evenodd"
        d="M 1272.96 985.63 L 767.9 985.63 L 1022.98 641.31 L 1245.41 947.48 Z"
      />
    </svg>
  );
}

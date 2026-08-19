import type { SVGProps } from "react";

/**
 * Custom line-art dental icons, drawn to match the lucide stroke language
 * (24px grid, 1.75 stroke, round caps) used elsewhere on the site.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const TOOTH =
  "M12 4c-1.8 0-2.4-1-4.2-1C5.9 3 4.5 4.4 4.5 6.8c0 2.2.8 3.3 1.4 5.2.5 1.6.6 3.1.8 5 .2 1.3.6 2.5 1.5 2.5 1.2 0 1.3-2 1.6-3.6.2-1.2.5-2.1 1.2-2.1s1 .9 1.2 2.1c.3 1.6.4 3.6 1.6 3.6.9 0 1.3-1.2 1.5-2.5.2-1.9.3-3.4.8-5 .6-1.9 1.4-3 1.4-5.2C17.5 4.4 16.1 3 14.2 3 12.4 3 11.8 4 12 4Z";

export function ToothImplantIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.6c-1.6 0-2.2-.9-3.8-.9-1.7 0-3 1.3-3 3.4 0 2 .7 3 1.3 4.7.4 1.4.5 2.8.7 4.5.2 1.2.5 2.2 1.3 2.2 1.1 0 1.2-1.8 1.5-3.2.2-1.1.4-1.9 1.1-1.9" />
      <path d="M14.3 2.7c1.7 0 3 1.3 3 3.4 0 1.4-.4 2.4-.8 3.5" />
      <path d="M14.5 12.5h5" />
      <path d="M14.5 15.5h5" />
      <path d="M14.5 18.5h5" />
      <path d="M17 12.5V22" />
    </svg>
  );
}

export function ToothCrownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 9.5 3 4.5l3.6 2.2L9 3l3 3.7L15 3l2.4 3.7L21 4.5l-1.5 5Z" />
      <path d="M4.5 9.5h15" />
      <path d="M7 13c.2 1.6.4 3.2.6 4.7.2 1.3.6 2.4 1.4 2.4 1.1 0 1.2-1.9 1.5-3.3.2-1.1.4-2 1.1-2s.9.9 1.1 2c.3 1.4.4 3.3 1.5 3.3.8 0 1.2-1.1 1.4-2.4.2-1.5.4-3.1.6-4.7" />
    </svg>
  );
}

export function ToothRootIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d={TOOTH} />
      <path d="M12 7.5v6" />
      <path d="M9.6 16.5 12 13.5l2.4 3" />
    </svg>
  );
}

export function ToothBrushIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.5 4h4a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M9.6 4V2.2M11.5 4V1.8M13.4 4V2.2" />
      <path d="M11.5 11.5v6.8a2 2 0 0 1-4 0v-.6" />
    </svg>
  );
}

export function ToothSparkleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d={TOOTH} />
      <path d="M18.5 15.5 19 17l1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5Z" />
    </svg>
  );
}

export function ToothShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21c3.5-1.4 6-4.3 6-8V5.6L12 3 6 5.6V13c0 3.7 2.5 6.6 6 8Z" />
      <path d="M12 7.6c-.8 0-1.1-.5-2-.5-.9 0-1.6.7-1.6 1.8 0 1 .4 1.6.7 2.5.2.8.3 1.5.4 2.4.1.6.3 1.1.7 1.1.6 0 .6-1 .8-1.7.1-.6.2-1 .6-1s.5.4.6 1c.2.7.2 1.7.8 1.7.4 0 .6-.5.7-1.1.1-.9.2-1.6.4-2.4.3-.9.7-1.5.7-2.5 0-1.1-.7-1.8-1.6-1.8-.9 0-1.2.5-2 .5Z" />
    </svg>
  );
}

export function ToothDropletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d={TOOTH} />
      <path d="M19 13.5c0-1.2-1.6-2.8-1.6-2.8s-1.6 1.6-1.6 2.8a1.6 1.6 0 0 0 3.2 0Z" />
    </svg>
  );
}

export function ToothMirrorIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d={TOOTH} />
      <circle cx="18" cy="15.5" r="2.5" />
      <path d="m16.2 17.3-2.4 2.4" />
    </svg>
  );
}

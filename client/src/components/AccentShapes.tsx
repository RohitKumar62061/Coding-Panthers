/**
 * Reusable geometric accent shape components for Scandinavian design
 */

interface AccentShapeProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
  xl: "w-96 h-96",
};

/**
 * Soft pastel blue circle accent
 */
export function AccentCircleBlue({ className = "", size = "md" }: AccentShapeProps) {
  return (
    <div className={`accent-shape-circle ${sizeMap[size]} ${className}`} />
  );
}

/**
 * Soft blush pink circle accent
 */
export function AccentCirclePink({ className = "", size = "md" }: AccentShapeProps) {
  return (
    <div className={`accent-shape-circle-pink ${sizeMap[size]} ${className}`} />
  );
}

/**
 * Soft pastel blue blob accent
 */
export function AccentBlobBlue({ className = "", size = "md" }: AccentShapeProps) {
  return (
    <div className={`accent-shape-blob ${sizeMap[size]} ${className}`} />
  );
}

/**
 * Soft blush pink blob accent
 */
export function AccentBlobPink({ className = "", size = "md" }: AccentShapeProps) {
  return (
    <div className={`accent-shape-blob-pink ${sizeMap[size]} ${className}`} />
  );
}

/**
 * Gradient overlay - subtle blue
 */
export function GradientBlue({ className = "" }: { className?: string }) {
  return <div className={`gradient-subtle-blue ${className}`} />;
}

/**
 * Gradient overlay - subtle pink
 */
export function GradientPink({ className = "" }: { className?: string }) {
  return <div className={`gradient-subtle-pink ${className}`} />;
}

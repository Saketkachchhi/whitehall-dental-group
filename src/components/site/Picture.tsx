import type { ImageAsset } from "@/data/site";
import { cn } from "@/lib/utils";

const OPT = "/images/opt";

const srcset = (img: ImageAsset, ext: string) =>
  img.widths.map((w) => `${OPT}/${img.base}-${w}.${ext} ${w}w`).join(", ");

/** Largest generated fallback — used as the <img src> for non-srcset clients. */
export const fallbackSrc = (img: ImageAsset) =>
  `${OPT}/${img.base}-${img.widths[img.widths.length - 1]}.${img.ext}`;

/**
 * Responsive <picture> emitting AVIF -> WebP -> jpg/png.
 *
 * width/height are the source's TRUE intrinsic dimensions so the browser can
 * reserve exact layout space (CLS). Any visual crop is done in CSS via
 * `className` (e.g. aspect-4/5 object-cover), which overrides the ratio for
 * presentation without lying about the asset.
 */
export function Picture({
  img,
  alt,
  sizes,
  className,
  imgClassName,
  priority = false,
  fetchPriority,
}: {
  img: ImageAsset;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcset(img, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(img, "webp")} sizes={sizes} />
      <img
        src={fallbackSrc(img)}
        srcSet={srcset(img, img.ext)}
        sizes={sizes}
        alt={alt}
        width={img.w}
        height={img.h}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
        className={cn("max-w-full", imgClassName)}
      />
    </picture>
  );
}

/** Preload hrefs for the LCP image, for use in a route's head().links. */
export function preloadImage(img: ImageAsset, sizes: string) {
  return {
    rel: "preload" as const,
    as: "image" as const,
    type: "image/avif",
    imageSrcSet: srcset(img, "avif"),
    imageSizes: sizes,
    fetchPriority: "high" as const,
  };
}

import Image from 'next/image';

type FeaturedImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: "fixed" | "intrinsic" | "responsive" | "fill";
  caption?: string;
}

export default function FeaturedImage({ alt, src, layout, width, height, caption }: FeaturedImageProps) {
  let props;

  if (layout) {
    props = { layout };
  } else {
    props = { width, height };
  }

  return (
    <figure className="featured-image" style={{ height: width ? `${width}px` : '200px' }}>
      <Image
        src={src}
        {...props}
        alt={alt}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

import Image, { ImageProps } from 'next/image';

const ResponsiveImage = ({ src, alt, priority = false, className, ...props }: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      className={`${className || ''}`}
      {...props}
    />
  );
};

export default ResponsiveImage;
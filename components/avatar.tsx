import Image from 'next/image';

interface IAvatarProps {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export default function Avatar({
  src = 'https://gravatar.com/avatar/997c72f0b7ca0fc26bdf60ca27cb4194.png?s=300',
  width = 150,
  height = 150,
  alt = 'Douglas Moura',
}: IAvatarProps) {
  return (
    <figure className="avatar">
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
      />
    </figure>
  );
}

import { useRouter } from 'next/router';

export default function isHome() {
  const { route } = useRouter();

  return route === '/';
}

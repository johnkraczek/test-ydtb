import { env } from '@/env'

export default function Home() {
  return (
    <p>env: {env.NEXT_PUBLIC_APP_URL}</p>
  );
}
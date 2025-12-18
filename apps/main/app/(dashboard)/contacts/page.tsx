import { env } from '@ydtb/core/env'

export default function Home() {
  return (
    <p>env: {env.NEXT_PUBLIC_APP_URL}</p>
  );
}
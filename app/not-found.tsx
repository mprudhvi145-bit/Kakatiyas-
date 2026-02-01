
import Link from 'next/link';
import { Button } from '../components/ui/Shared';

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-kakatiya-base text-center px-4">
      <h1 className="font-royal text-6xl md:text-9xl text-stone-200 mb-8">404</h1>
      <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">A thread lost in time.</h2>
      <p className="font-sans text-stone-500 mb-10 max-w-md mx-auto">
        The page you are looking for has been moved or does not exist. 
        Return to our collection to find what you seek.
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}

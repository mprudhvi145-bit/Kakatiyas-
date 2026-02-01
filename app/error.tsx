
'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '../components/ui/Shared';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-stone-50 text-center px-4">
      <h2 className="font-serif text-2xl text-stone-900 mb-4">Something went wrong.</h2>
      <p className="text-stone-500 mb-8 text-sm">Our artisans are working to restore the balance.</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="primary">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Return Home
        </Button>
      </div>
    </div>
  );
}

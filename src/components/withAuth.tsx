import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;

      if (!session) {
        router.replace('/auth/signin');
      }
    }, [session, status]);

    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    if (!session) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 
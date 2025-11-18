'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: true });

function RouteLoadingContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return null;
}

export default function RouteLoading() {
  return (
    <Suspense fallback={null}>
      <RouteLoadingContent />
    </Suspense>
  );
}

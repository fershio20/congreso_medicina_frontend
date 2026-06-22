import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GOOGLE_ANALYTICS_ID } from '@/lib/globalConstants';

export default function GoogleAnalytics() {
  const router = useRouter();

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID) return;

    const handleRouteChange = (url: string) => {
      window.gtag('config', GOOGLE_ANALYTICS_ID, { page_path: url });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  if (!GOOGLE_ANALYTICS_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ANALYTICS_ID}');
        `}
      </Script>
    </>
  );
}

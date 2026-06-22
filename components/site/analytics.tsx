import Script from 'next/script';
import { env, capabilities } from '@/lib/env';

/**
 * Loads GA4 and the Meta Pixel only when their IDs are configured. Server
 * component that emits <Script> tags; the actual event calls live in
 * lib/analytics.ts (client). Server-side conversions go through lib/meta-capi.ts.
 */
export function Analytics() {
  return (
    <>
      {capabilities.ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());gtag('config','${env.NEXT_PUBLIC_GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {env.META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,
            'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${env.META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}

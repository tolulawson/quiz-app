import Script from 'next/script';

export default function PageHelmet({ children }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_googleAnalyticsId}`}
        strategy='lazyOnload'
      />
      <Script strategy='lazyOnload'>
        {
          `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '${process.env.NEXT_PUBLIC_googleAnalyticsId}');`
        }
      </Script>
      {
        children
      }
    </>
  );
}

import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { URL_DOMAIN } from '@/lib/globalConstants';

interface GlobalSEO {
  site_description: string;
  site_keywords: string;
  canonical_domain: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  facebook_pixel_id?: string;
  default_og_image: {
    url: string;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

interface PageSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string };
  og_type?: string;
  twitter_card?: string;
  canonical_url?: string;
  no_index?: boolean;
  structured_data?: Record<string, unknown>;
}

interface SEOProps {
  pageSEO?: PageSEO;
  globalSEO?: GlobalSEO | null;
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;
  pageUrl?: string;
  pageType?: 'website' | 'article' | 'event' | 'organization';
  logoUrl?: string | null;
}

const SEO: React.FC<SEOProps> = ({
  pageSEO,
  globalSEO,
  pageTitle,
  pageDescription,
  pageImage,
  pageUrl,
  pageType = 'website',
  logoUrl
}) => {
  // Determine final values with fallbacks
  const finalTitle = pageSEO?.meta_title || pageTitle || 'Congreso de Pediatría Paraguay 2025';
  const finalDescription = pageSEO?.meta_description || pageDescription || globalSEO?.site_description || 'Congreso Internacional de Pediatría en Paraguay';
  const finalKeywords = pageSEO?.meta_keywords || globalSEO?.site_keywords;
  const finalImage = pageSEO?.og_image?.url || pageImage || globalSEO?.default_og_image?.url;
  const finalUrl = pageSEO?.canonical_url || pageUrl || globalSEO?.canonical_domain;
  const finalOgTitle = pageSEO?.og_title || pageSEO?.meta_title || finalTitle;
  const finalOgDescription = pageSEO?.og_description || pageSEO?.meta_description || finalDescription;
  const finalOgType = pageSEO?.og_type || pageType;
  const finalTwitterCard = pageSEO?.twitter_card || 'summary_large_image';
  const finalNoIndex = pageSEO?.no_index || false;

  return (
    <>
      <Head>
        {/* Favicon */}
        {logoUrl && (
          <>
            <link rel="icon" href={logoUrl} />
            <link rel="apple-touch-icon" href={logoUrl} />
          </>
        )}
        
        {/* Basic Meta Tags */}
        <title>{finalTitle}</title>
        <meta name="description" content={finalDescription} />
        {finalKeywords && <meta name="keywords" content={finalKeywords} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={finalOgTitle} />
        <meta property="og:description" content={finalOgDescription} />
        <meta property="og:type" content={finalOgType} />
        <meta property="og:url" content={finalUrl} />
        {finalImage && <meta property="og:image" content={finalImage.startsWith('http') ? finalImage : `${URL_DOMAIN}${finalImage}`} />}
        <meta property="og:site_name" content="Congreso de Pediatría Paraguay 2025" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={finalTwitterCard} />
        <meta name="twitter:title" content={finalOgTitle} />
        <meta name="twitter:description" content={finalOgDescription} />
        {finalImage && <meta name="twitter:image" content={finalImage.startsWith('http') ? finalImage : `${URL_DOMAIN}${finalImage}`} />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={finalUrl} />
        
        {/* Robots */}
        <meta name="robots" content={finalNoIndex ? "noindex, nofollow" : "index, follow"} />
      </Head>

      {/* Google Analytics - Using next/script as recommended by Next.js */}
      {globalSEO?.google_analytics_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${globalSEO.google_analytics_id}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${globalSEO.google_analytics_id}');
            `}
          </Script>
        </>
      )}
      
      {/* Google Tag Manager - Using next/script as recommended by Next.js */}
      {globalSEO?.google_tag_manager_id && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${globalSEO.google_tag_manager_id}');
            `}
          </Script>
          
          {/* Google Tag Manager (noscript) - Must be in body */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${globalSEO.google_tag_manager_id}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
      
      {/* Facebook Pixel - Using next/script as recommended by Next.js */}
      {globalSEO?.facebook_pixel_id && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${globalSEO.facebook_pixel_id}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
      
      {/* Consent Mode v2 and Helpers */}
      {(globalSEO?.google_analytics_id || globalSEO?.google_tag_manager_id) && (
        <Script id="consent-mode-and-helpers" strategy="afterInteractive">
          {`
            // Consent Mode v2 - set default state
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
            
            // Global consent helper functions
            window.__grantAllConsents = function(){
              gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted'
              });
            }
            window.__denyAllConsents = function(){
              gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
              });
            }
          `}
        </Script>
      )}
      
      {/* Structured Data */}
      {pageSEO?.structured_data && (
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(pageSEO.structured_data)}
        </Script>
      )}
      
      {/* Medical Event Structured Data (if no custom structured data) */}
      {!pageSEO?.structured_data && pageType === 'event' && (
        <Script
          id="medical-event-structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalEvent",
            "name": finalTitle,
            "description": finalDescription,
            "eventType": "Medical Conference",
            "medicalSpecialty": "Pediatrics",
            "organizer": {
              "@type": "Organization",
              "name": "Sociedad Paraguaya de Pediatría"
            },
            "location": {
              "@type": "Place",
              "name": "Paraguay"
            }
          })}
        </Script>
      )}
    </>
  );
};

export default SEO;

import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'ConvertHub';
const SITE_URL = 'https://converthub.com';
const DEFAULT_IMAGE = 'https://converthub.com/og-default.png';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  breadcrumbs,
  structuredData,
  noIndex,
}: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = canonical || `${SITE_URL}${window.location.pathname}`;
  const image = ogImage || DEFAULT_IMAGE;

  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }
    : null;

  const allSchemas = [
    breadcrumbSchema,
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
  ].filter(Boolean);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', ...schema })}
        </script>
      ))}
    </Helmet>
  );
}

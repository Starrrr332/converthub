import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, ExternalLink } from 'lucide-react';
import { PrivacyBanner } from '../converter/PrivacyBanner';
import { FavoriteButton } from '../ui/FavoriteButton';
import { ShareButton } from '../ui/ShareButton';
import { useTabsStore } from '../../store/tabsStore';
import { SEOHead, type BreadcrumbItem } from '../seo/SEOHead';
import { JsonLd } from '../seo/JsonLd';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
  showPrivacyBanner?: boolean;
  breadcrumb?: { label: string; to?: string }[];
  /** SEO: meta description for the page */
  description?: string;
  /** SEO: canonical URL override */
  canonical?: string;
  /** SEO: custom OG image URL */
  ogImage?: string;
  /** SEO: JSON-LD structured data */
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export function PageLayout({
  title,
  subtitle,
  children,
  wide = false,
  showPrivacyBanner = true,
  breadcrumb,
  description,
  canonical,
  ogImage,
  structuredData,
}: PageLayoutProps) {
  const location = useLocation();
  const { addTab } = useTabsStore();

  const handleOpenInTab = () => {
    addTab(location.pathname, title);
  };

  const seoBreadcrumbs: BreadcrumbItem[] | undefined = breadcrumb?.map((b) => ({
    name: b.label,
    url: b.to ? `https://converthub.com${b.to}` : `https://converthub.com${location.pathname}`,
  }));

  return (
    <>
      {description && (
        <SEOHead
          title={title}
          description={description}
          canonical={canonical}
          ogImage={ogImage}
          breadcrumbs={seoBreadcrumbs}
        />
      )}
      {structuredData && <JsonLd data={structuredData} />}
      <div className={wide ? 'page-container-wide' : 'page-container'}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            className="flex items-center gap-1.5 text-sm text-slate-500 mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-indigo-600 transition-colors p-1 -ml-1 rounded-lg hover:bg-slate-100"
            >
              <Home className="w-4 h-4" />
            </Link>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                {item.to ? (
                  <Link to={item.to} className="hover:text-indigo-600 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-700 font-medium">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-lg text-slate-600 max-w-2xl">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 mt-1">
            <FavoriteButton path={location.pathname} />
            <ShareButton />
            <button
              onClick={handleOpenInTab}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text bg-surface-secondary hover:bg-slate-200 rounded-lg transition-colors"
              title="Abrir en nueva pestaña"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {showPrivacyBanner && (
          <div className="mb-8">
            <PrivacyBanner />
          </div>
        )}

        {children}
      </div>
    </>
  );
}

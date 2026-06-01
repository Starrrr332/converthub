import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { PrivacyBanner } from '../converter/PrivacyBanner';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
  showPrivacyBanner?: boolean;
  breadcrumb?: { label: string; to?: string }[];
}

export function PageLayout({
  title,
  subtitle,
  children,
  wide = false,
  showPrivacyBanner = true,
  breadcrumb,
}: PageLayoutProps) {
  return (
    <div className={wide ? 'page-container-wide' : 'page-container'}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-indigo-600 transition-colors p-1 -ml-1 rounded-lg hover:bg-slate-100">
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

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-lg text-slate-600 max-w-2xl">{subtitle}</p>}
      </header>

      {showPrivacyBanner && (
        <div className="mb-8">
          <PrivacyBanner />
        </div>
      )}

      {children}
    </div>
  );
}

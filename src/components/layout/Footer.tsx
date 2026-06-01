import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Heart } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="page-container py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-base font-bold text-text">{t('app.name')}</h3>
            <p className="text-sm text-text-secondary mt-1.5 max-w-xs">{t('app.tagline')}</p>
            <Link to="/pricing" className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              <Heart className="w-3.5 h-3.5" />
              Donar
            </Link>
          </div>

          {/* Convertidores */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Convertidores</h4>
            <ul className="space-y-2">
              <li><Link to="/converter/image" className="text-sm text-text-secondary hover:text-text transition-colors">Imágenes</Link></li>
              <li><Link to="/converter/pdf" className="text-sm text-text-secondary hover:text-text transition-colors">PDF</Link></li>
              <li><Link to="/converter/audio" className="text-sm text-text-secondary hover:text-text transition-colors">Audio</Link></li>
              <li><Link to="/converter/video" className="text-sm text-text-secondary hover:text-text transition-colors">Video</Link></li>
            </ul>
          </div>

          {/* Editores */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Editores</h4>
            <ul className="space-y-2">
              <li><Link to="/editor/image" className="text-sm text-text-secondary hover:text-text transition-colors">Imágenes</Link></li>
              <li><Link to="/editor/text" className="text-sm text-text-secondary hover:text-text transition-colors">Texto</Link></li>
              <li><Link to="/editor/json" className="text-sm text-text-secondary hover:text-text transition-colors">JSON</Link></li>
              <li><Link to="/editor/markdown" className="text-sm text-text-secondary hover:text-text transition-colors">Markdown</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-text-secondary hover:text-text transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/devtools" className="text-sm text-text-secondary hover:text-text transition-colors">DevTools</Link></li>
              <li><Link to="/tools/utilities" className="text-sm text-text-secondary hover:text-text transition-colors">Utilidades</Link></li>
            </ul>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-green-600">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('footer.privacy')}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-text-muted">{t('footer.copyright')}</p>
          <p className="text-xs text-text-muted">{t('footer.privacyNote')}</p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { usePremiumStore } from '../../store/premiumStore';
import { AdBanner } from '../ads/AdBanner';

interface FooterProps {
  isPremium: boolean;
}

export function Footer(_props: FooterProps) {
  const { t } = useTranslation();
  const premium = usePremiumStore();
  
  return (
    <footer className="bg-white border-t mt-auto">
      {/* Ad Banner for free users */}
      {!premium.isPremium() && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AdBanner position="bottom" />
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t('app.name')}</h3>
            <p className="text-sm text-gray-600 mt-2">{t('app.tagline')}</p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@converthub.com"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Privacy Seal */}
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center gap-2 text-green-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">100% Privado</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-left md:text-right">
              Tus archivos nunca salen de tu navegador
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500 text-center">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}

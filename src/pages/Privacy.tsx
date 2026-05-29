import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

export function Privacy() {
  const { t } = useTranslation('privacy');
  
  const sections = t('sections', { returnObjects: true }) as Array<{
    heading: string;
    content: string;
  }>;
  
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('lastUpdated')}
          </p>
        </div>
        
        {/* Content */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {section.heading}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
        
        {/* Contact */}
        <div className="mt-12 card bg-green-50 border border-green-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ¿Tienes preguntas?
          </h2>
          <p className="text-gray-600 mb-4">
            Si tienes alguna pregunta sobre esta política de privacidad, contáctanos:
          </p>
          <a
            href="mailto:privacy@converthub.com"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            privacy@converthub.com
          </a>
        </div>
      </div>
    </div>
  );
}

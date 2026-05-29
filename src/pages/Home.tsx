import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Gift, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';

export function Home() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Shield,
      title: t('features.privacy.title'),
      description: t('features.privacy.description')
    },
    {
      icon: Zap,
      title: t('features.fast.title'),
      description: t('features.fast.description')
    },
    {
      icon: Gift,
      title: t('features.free.title'),
      description: t('features.free.description')
    }
  ];
  
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {t('hero.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/converter">
            <Button size="lg">
              {t('hero.cta')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg">
              {t('nav.pricing')}
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Privacy Banner */}
      <section className="max-w-3xl mx-auto mt-12 px-4">
        <PrivacyBanner />
      </section>
      
      {/* Features */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Supported Formats */}
      <section className="max-w-4xl mx-auto mt-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Formatos soportados
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['PNG', 'JPEG', 'WebP', 'BMP', 'GIF'].map((format) => (
            <span
              key={format}
              className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
            >
              {format}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

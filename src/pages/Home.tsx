import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Gift, ArrowRight, Image, FileText, Table, Music } from 'lucide-react';
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
  
  const converters = [
    {
      icon: Image,
      title: t('nav.converters.image'),
      description: t('nav.converters.imageDesc'),
      path: '/converter/image',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FileText,
      title: t('nav.converters.pdf'),
      description: t('nav.converters.pdfDesc'),
      path: '/converter/pdf',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Table,
      title: t('nav.converters.csv'),
      description: t('nav.converters.csvDesc'),
      path: '/converter/csv',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Music,
      title: t('nav.converters.audio'),
      description: t('nav.converters.audioDesc'),
      path: '/converter/audio',
      color: 'bg-purple-100 text-purple-600'
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
          <Link to="/converter/image">
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
      
      {/* Converters Grid */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          {t('nav.convert')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {converters.map((converter, index) => (
            <Link
              key={index}
              to={converter.path}
              className="card text-center hover:shadow-xl transition-shadow group"
            >
              <div className={`inline-flex p-4 rounded-full mb-4 ${converter.color} group-hover:scale-110 transition-transform`}>
                <converter.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {converter.title}
              </h3>
              <p className="text-sm text-gray-600">
                {converter.description}
              </p>
            </Link>
          ))}
        </div>
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
    </div>
  );
}

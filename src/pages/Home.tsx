import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  Upload,
  Sliders,
  Download,
  Heart,
  Image,
  FileText,
  Edit3,
  Wrench,
  Cpu,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';
import { SEOHead } from '../components/seo/SEOHead';
import { buildOrganizationSchema, buildWebSiteSchema } from '../utils/structuredData';
import {
  featuredConverters,
  featuredEditors,
  featuredTools,
  converterTools,
  editorTools,
  standaloneTools,
  devtoolTools,
  utilityTools,
} from '../config/toolRegistry';

export function Home() {
  const { t } = useTranslation();

  const stats = [
    { value: '52+', label: t('hero.stats.tools_alt') },
    { value: '100%', label: t('hero.stats.inBrowser') },
    { value: t('hero.stats.freeLabel'), label: t('hero.stats.noSignup') },
    { value: t('hero.stats.private'), label: t('hero.stats.noServers') },
  ];

  const howItWorks = [
    {
      icon: Upload,
      title: t('home.steps.upload.title'),
      description: t('home.steps.upload.desc'),
    },
    {
      icon: Sliders,
      title: t('home.steps.choose.title'),
      description: t('home.steps.choose.desc'),
    },
    {
      icon: Download,
      title: t('home.steps.download.title'),
      description: t('home.steps.download.desc'),
    },
  ];

  const features = [
    {
      icon: Shield,
      title: t('home.features.privacy.title'),
      description: t('home.features.privacy.desc'),
    },
    {
      icon: Zap,
      title: t('home.features.fast.title'),
      description: t('home.features.fast.desc'),
    },
    {
      icon: Sparkles,
      title: t('home.features.free.title'),
      description: t('home.features.free.desc'),
    },
  ];

  const categories = [
    {
      key: 'converter',
      icon: Image,
      label: t('nav.sections.converters'),
      description: t('nav.sections.convertersDesc'),
      count: converterTools.length,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      borderHover: 'hover:border-indigo-200',
      path: '/converter',
    },
    {
      key: 'editor',
      icon: Edit3,
      label: t('nav.sections.editors'),
      description: t('nav.sections.editorsDesc'),
      count: editorTools.length,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      borderHover: 'hover:border-violet-200',
      path: '/editor',
    },
    {
      key: 'tool',
      icon: Wrench,
      label: t('nav.sections.tools'),
      description: t('nav.sections.toolsDesc'),
      count: standaloneTools.length,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      borderHover: 'hover:border-purple-200',
      path: '/tools',
    },
    {
      key: 'devtool',
      icon: Cpu,
      label: t('nav.sections.devtools'),
      description: t('nav.sections.devtoolsDesc'),
      count: devtoolTools.length,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      borderHover: 'hover:border-slate-200',
      path: '/devtools',
    },
    {
      key: 'utility',
      icon: FileText,
      label: t('nav.sections.utilities'),
      description: t('nav.sections.utilitiesDesc'),
      count: utilityTools.length,
      color: 'text-fuchsia-600',
      bg: 'bg-fuchsia-50',
      borderHover: 'hover:border-fuchsia-200',
      path: '/utilities',
    },
  ];

  const orgSchema = buildOrganizationSchema();
  const webSiteSchema = buildWebSiteSchema();

  return (
    <>
      <SEOHead
        title={t('app.name') + ' - ' + t('hero.headline')}
        description={t('hero.subtitle')}
        canonical="https://converthub.com"
        breadcrumbs={[{ name: t('nav.home'), url: 'https://converthub.com' }]}
        structuredData={[orgSchema, webSiteSchema]}
      />
      <div>
        {/* ───── Hero ───── */}
        <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-1/4 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/4 w-56 h-56 bg-accent-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-secondary to-transparent" />
          </div>

          <div className="page-container relative">
            <div className="max-w-2xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent-50 text-accent-700 rounded-full text-xs font-medium mb-6 animate-slide-up stagger-1 border border-accent-100">
                <Sparkles className="w-3.5 h-3.5" />
                {t('hero.badge')}
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.1] animate-slide-up stagger-2">
                {t('hero.headline')} <span className="text-gradient">{t('hero.headlineHighlight')}</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-lg sm:text-xl text-text-secondary max-w-lg mx-auto leading-relaxed animate-slide-up stagger-3">
                {t('hero.subhead')}{' '}
                <span className="text-text-primary font-medium">{t('hero.subheadHighlight')}</span>
              </p>

              {/* CTA Buttons */}
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center animate-slide-up stagger-4">
                <Link to="/converter/image">
                  <Button size="lg" className="shadow-lg hover:shadow-xl">
                    {t('hero.exploreTools')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">
                    <Heart className="w-4 h-4" />
                    {t('nav.pricing')}
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex items-center justify-center gap-4 text-xs text-text-muted animate-fade-in stagger-6">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-success" />
                  {t('hero.trustServerless')}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{t('hero.trustBrowser')}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{t('hero.trustNoSignup')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Stats ───── */}
        <section className="border-y border-border bg-surface">
          <div className="page-container py-7 sm:py-9">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className={`text-center animate-slide-up stagger-${i + 1}`}>
                  <p className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Privacy Banner ───── */}
        <section className="page-container mt-10 sm:mt-12 animate-slide-up stagger-3">
          <PrivacyBanner />
        </section>

        {/* ───── How It Works ───── */}
        <section className="page-container mt-20 sm:mt-24">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="section-heading">{t('home.howItWorks')}</h2>
            <p className="section-subheading mx-auto">{t('home.howItWorksDesc')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {howItWorks.map((item, i) => (
              <div key={i} className={`text-center p-6 animate-slide-up stagger-${i + 2}`}>
                {/* Icon circle */}
                <div className="relative w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group hover:bg-accent-100 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-accent-500 transition-transform duration-300 group-hover:scale-110" />
                </div>
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent-600 text-white text-xs font-bold mb-3 shadow-sm">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-text-primary text-base mb-1.5">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ───── Categories ───── */}
        <section className="page-container mt-20 sm:mt-24">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="section-heading">{t('home.categories')}</h2>
            <p className="section-subheading mx-auto">
              {t('home.categoriesDesc')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.key}
                to={cat.path}
                className={`card-interactive flex items-center gap-4 ${cat.borderHover} animate-slide-up stagger-${i + 1}`}
              >
                <div
                  className={`p-3.5 rounded-xl ${cat.bg} ${cat.color} transition-transform duration-200`}
                >
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-text-primary">{cat.label}</h3>
                  <p className="text-sm text-text-secondary">{cat.description}</p>
                  <p className="text-xs text-text-muted mt-1">{t('home.toolsCount', { count: cat.count })}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* ───── Featured Converters ───── */}
        <section className="page-container mt-20 sm:mt-24">
          <div className="flex items-center justify-between mb-8 animate-slide-up">              <h2 className="section-heading">{t('home.popularConverters')}</h2>
            <Link
              to="/converter"
              className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors"
            >
              {t('nav.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {featuredConverters.map((tool, i) => (
              <Link
                key={tool.path}
                to={tool.path}
                className={`card-interactive text-center ${tool.hover} animate-slide-up stagger-${(i % 5) + 1}`}
              >
                <div
                  className={`inline-flex p-3.5 rounded-xl ${tool.bg} ${tool.color} mb-3 transition-transform duration-200 hover:scale-105`}
                >
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-text-primary text-sm">{tool.name}</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{tool.homeDesc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ───── Featured Editors ───── */}
        <section className="bg-surface-secondary mt-20 sm:mt-24 py-20 sm:py-24">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8 animate-slide-up">
              <h2 className="section-heading">{t('home.popularEditors')}</h2>
              <Link
                to="/editor"
                className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors"
              >
                {t('nav.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {featuredEditors.map((tool, i) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`card-interactive flex items-center gap-4 ${tool.hover} animate-slide-up stagger-${(i % 3) + 1}`}
                >
                  <div className="p-2.5 rounded-xl bg-accent-50 text-accent-700 shrink-0 transition-transform duration-200 hover:scale-105">
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm">{tool.name}</h3>
                    <p className="text-xs text-text-secondary mt-0.5">{tool.homeDesc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Featured Tools ───── */}
        <section className="page-container mt-20 sm:mt-24">
          <div className="flex items-center justify-between mb-8 animate-slide-up">
            <h2 className="section-heading">{t('home.usefulTools')}</h2>
            <Link
              to="/tools"
              className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors"
            >
              {t('nav.viewAllF')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool, i) => (
              <Link
                key={tool.path}
                to={tool.path}
                className={`card-interactive text-center ${tool.hover} animate-slide-up stagger-${(i % 3) + 1}`}
              >
                <div
                  className={`inline-flex p-3.5 rounded-xl ${tool.bg} ${tool.color} mb-3 transition-transform duration-200 hover:scale-105`}
                >
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-text-primary text-sm">{tool.name}</h3>
                <p className="text-xs text-text-secondary mt-1">{tool.homeDesc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ───── Why ConvertHub ───── */}
        <section
          className="mt-20 sm:mt-24 py-20 sm:py-24"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-900), var(--color-accent-800))',
          }}
        >
          <div className="page-container">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {t('home.why')}
              </h2>
              <p className="text-accent-200 mt-3 max-w-xl mx-auto">
                {t('home.whyDesc')}
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((item, i) => (
                <div
                  key={i}
                  className={`text-center p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-300 animate-slide-up stagger-${i + 2}`}
                >
                  <div className="inline-flex p-3 rounded-xl bg-accent-400/15 mb-5">
                    <item.icon className="w-6 h-6 text-accent-300" />
                  </div>
                  <h3 className="font-semibold text-white text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-accent-200/80 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Final CTA ───── */}
        <section className="page-container my-20 sm:my-24 text-center">
          <div
            className="max-w-lg mx-auto p-10 sm:p-12 rounded-3xl animate-slide-up"
            style={{
              background:
                'linear-gradient(135deg, var(--color-accent-600), var(--color-accent-800))',
            }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('home.readyToStart')}</h2>
            <p className="text-accent-100 text-sm sm:text-base mb-8 leading-relaxed">
              {t('home.readyDesc')}
            </p>
            <Link to="/converter/image">
              <Button
                size="lg"
                className="bg-white text-accent-700 hover:bg-accent-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('home.startNow')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

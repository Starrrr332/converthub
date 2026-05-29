import { useTranslation } from 'react-i18next';
import { PricingCard } from '../components/pricing/PricingCard';
import { usePremiumStore } from '../store/premiumStore';

export function Pricing() {
  const { t } = useTranslation('pricing');
  const premium = usePremiumStore();
  
  const handleSelectPlan = (plan: 'free' | 'premium') => {
    if (plan === 'premium') {
      // TODO: Integrate MercadoPago
      console.log('Redirect to MercadoPago checkout');
    }
  };
  
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <PricingCard
            plan="free"
            price={t('plans.free.price')}
            period={t('plans.free.period')}
            features={t('plans.free.features', { returnObjects: true }) as string[]}
            isCurrentPlan={premium.plan === 'free'}
            onSelect={() => handleSelectPlan('free')}
          />
          
          {/* Premium Plan */}
          <PricingCard
            plan="premium"
            price={t('plans.premium.price')}
            period={t('plans.premium.period')}
            features={t('plans.premium.features', { returnObjects: true }) as string[]}
            isCurrentPlan={premium.plan === 'premium'}
            onSelect={() => handleSelectPlan('premium')}
            badge={t('plans.premium.badge')}
          />
        </div>
        
        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t('faq.title')}
          </h2>
          
          <div className="space-y-6">
            {(t('faq.questions', { returnObjects: true }) as Array<{ q: string; a: string }>).map(
              (faq, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

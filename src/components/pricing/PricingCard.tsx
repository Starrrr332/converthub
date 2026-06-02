import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface PricingCardProps {
  plan: 'free' | 'premium';
  price: string;
  period: string;
  features: string[];
  isCurrentPlan: boolean;
  onSelect: () => void;
  badge?: string;
}

export function PricingCard({
  plan,
  price,
  period,
  features,
  isCurrentPlan,
  onSelect,
  badge,
}: PricingCardProps) {
  const { t } = useTranslation('pricing');

  const isPremium = plan === 'premium';

  return (
    <div
      className={`relative rounded-2xl p-8 ${
        isPremium
          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl'
          : 'bg-white text-gray-900 shadow-lg'
      }`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="badge-premium">{badge}</span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold">
          {isPremium ? t('plans.premium.name') : t('plans.free.name')}
        </h3>

        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className={`text-sm ${isPremium ? 'text-blue-100' : 'text-gray-500'}`}>
            {' '}
            {period}
          </span>
        </div>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 flex-shrink-0 ${isPremium ? 'text-blue-200' : 'text-green-500'}`}
            />
            <span className={`text-sm ${isPremium ? 'text-blue-100' : 'text-gray-600'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button
          variant={isPremium ? 'secondary' : 'outline'}
          className={`w-full ${isPremium ? 'bg-white text-blue-600 hover:bg-blue-50' : ''}`}
          disabled={isCurrentPlan}
          onClick={onSelect}
        >
          {isCurrentPlan ? t('plans.free.cta') : t('plans.premium.cta')}
        </Button>
      </div>
    </div>
  );
}

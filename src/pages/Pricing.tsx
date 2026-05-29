import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PricingCard } from '../components/pricing/PricingCard';
import { usePremiumStore } from '../store/premiumStore';
import { Shield, Check, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const PAYPAL_MONTHLY_PLAN = 'P-1YC31238NG798380PNINA63A';
const PAYPAL_ANNUAL_PLAN = 'P-2Y616961WD955583WNINA6LY';

export function Pricing() {
  const { t } = useTranslation('pricing');
  const premium = usePremiumStore();
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const handlePaymentSuccess = useCallback(() => {
    console.log('Payment approved!');
    const expiry = selectedPlan === 'monthly'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    premium.setSubscription('paypal-active', expiry);
    setPaymentSuccess(true);
    setShowPayPal(false);
  }, [selectedPlan, premium]);

  useEffect(() => {
    if (!showPayPal) return;

    let destroyed = false;

    const loadButtons = () => {
      if (destroyed) return;

      const w = window as unknown as Record<string, unknown>;
      const paypal = w.paypal as { Buttons?: (config: Record<string, unknown>) => { render: (sel: string) => void } } | undefined;

      if (!paypal?.Buttons) {
        setTimeout(loadButtons, 500);
        return;
      }

      const containerId = `paypal-btn-${selectedPlan}`;
      const container = document.getElementById(containerId);
      if (!container || destroyed) return;

      // Clear only the specific container, not innerHTML (avoids React conflict)
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      const planId = selectedPlan === 'monthly' ? PAYPAL_MONTHLY_PLAN : PAYPAL_ANNUAL_PLAN;

      paypal.Buttons({
        style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'subscribe' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createSubscription: (_data: unknown, actions: any) => {
          console.log('Creating subscription for plan:', planId);
          return actions.subscription.create({ plan_id: planId });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onApprove: (data: any) => {
          console.log('Payment approved, subscription ID:', data?.subscriptionID);
          handlePaymentSuccess();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          console.error('PayPal error:', err);
          setPaymentError(err?.message || 'Error en el pago. Intenta de nuevo.');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onCancel: () => {
          console.log('Payment cancelled');
        }
      }).render(`#${containerId}`);
    };

    const timer = setTimeout(loadButtons, 500);
    return () => { destroyed = true; clearTimeout(timer); };
  }, [showPayPal, selectedPlan, handlePaymentSuccess]);

  const handleSelectPlan = (plan: 'free' | 'premium') => {
    if (plan === 'premium') {
      setShowPayPal(true);
      setPaymentError(null);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('success.title')}</h1>
          <p className="text-gray-600 mb-8">{t('success.message')}</p>
          <Button onClick={() => window.location.href = '/converter/image'}>{t('success.cta')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PricingCard plan="free" price={t('plans.free.price')} period={t('plans.free.period')} features={t('plans.free.features', { returnObjects: true }) as string[]} isCurrentPlan={premium.plan === 'free'} onSelect={() => handleSelectPlan('free')} />
          <PricingCard plan="premium" price={t('plans.premium.price')} period={t('plans.premium.period')} features={t('plans.premium.features', { returnObjects: true }) as string[]} isCurrentPlan={premium.plan === 'premium'} onSelect={() => handleSelectPlan('premium')} badge={t('plans.premium.badge')} />
        </div>

        {showPayPal && (
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">{t('checkout.title')}</h3>

              <div className="flex gap-4 mb-6">
                <button onClick={() => setSelectedPlan('monthly')} className={`flex-1 p-4 rounded-lg border-2 transition-all ${selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <p className="font-medium">{t('checkout.monthly')}</p>
                  <p className="text-2xl font-bold">$5.50</p>
                  <p className="text-sm text-gray-500">USD/mes</p>
                </button>
                <button onClick={() => setSelectedPlan('annual')} className={`flex-1 p-4 rounded-lg border-2 transition-all relative ${selectedPlan === 'annual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <span className="absolute -top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">-33%</span>
                  <p className="font-medium">{t('checkout.annual')}</p>
                  <p className="text-2xl font-bold">$44.00</p>
                  <p className="text-sm text-gray-500">USD/año</p>
                </button>
              </div>

              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{paymentError}</p>
                </div>
              )}

              {/* Separate containers for each plan to avoid React DOM conflicts */}
              <div className="mb-4 min-h-[60px]">
                <div id="paypal-btn-monthly" style={{ display: selectedPlan === 'monthly' ? 'block' : 'none' }} />
                <div id="paypal-btn-annual" style={{ display: selectedPlan === 'annual' ? 'block' : 'none' }} />
                {selectedPlan === 'monthly' && (
                  <div className="text-center p-2 text-xs text-gray-400">Cargando botón PayPal mensual...</div>
                )}
                {selectedPlan === 'annual' && (
                  <div className="text-center p-2 text-xs text-gray-400">Cargando botón PayPal anual...</div>
                )}
              </div>

              <button onClick={() => setShowPayPal(false)} className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700">
                {t('checkout.cancel')}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            <span>{t('security.message')}</span>
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('faq.title')}</h2>
          <div className="space-y-6">
            {(t('faq.questions', { returnObjects: true }) as Array<{ q: string; a: string }>).map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

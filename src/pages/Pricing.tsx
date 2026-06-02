import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { usePremiumStore } from '../store/premiumStore';
import {
  Check,
  Crown,
  Shield,
  Zap,
  FileImage,
  FileText,
  HelpCircle,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';

declare global {
  interface Window {
    paypal?: {
      Buttons?: (config: Record<string, unknown>) => { render: (sel: string) => void };
    };
  }
}

const MONTHLY_PRICE = 5.50;
const ANNUAL_PRICE = 44.00;

export function Pricing() {
  const { t } = useTranslation('pricing');
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showPayPal, setShowPayPal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [loadingPaypal, setLoadingPaypal] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const { setPremium, checkPremium } = usePremiumStore();

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 30;
    const check = () => {
      attempts++;
      if (window.paypal?.Buttons) {
        setPaypalReady(true);
      } else if (attempts < maxAttempts) {
        setTimeout(check, 300);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (!showPayPal || !paypalReady) return;

    const timer = setTimeout(() => {
      setLoadingPaypal(true);
      const container = document.getElementById('paypal-button-container');
      if (!container) {
        setLoadingPaypal(false);
        return;
      }

      while (container.firstChild) container.removeChild(container.firstChild);

      try {
        if (!window.paypal?.Buttons) {
          setPaymentError('PayPal no está disponible. Recarga la página.');
          setLoadingPaypal(false);
          return;
        }

        const price = selectedPlan === 'monthly' ? MONTHLY_PRICE : ANNUAL_PRICE;
        const planName = selectedPlan === 'monthly' ? 'Mensual' : 'Anual';

        window.paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'subscribe' },
          createOrder: (_data: unknown, actions: Record<string, unknown>) => {
            return (actions.order as { create: (order: unknown) => Promise<string> }).create({
              purchase_units: [
                {
                  amount: { value: price.toFixed(2) },
                  description: `ConvertHub Premium - Plan ${planName} - $${price} USD`,
                },
              ],
            });
          },
          onApprove: async (_data: unknown, actions: Record<string, unknown>) => {
            try {
              const details = await (actions.order as { capture: () => Promise<Record<string, unknown>> }).capture();
              const now = new Date();
              const expiresAt = selectedPlan === 'annual'
                ? new Date(now.setFullYear(now.getFullYear() + 1))
                : new Date(now.setMonth(now.getMonth() + 1));

              const subscriptionId = (details.id as string) || `sub_${Date.now()}`;
              setPremium(subscriptionId, selectedPlan, '', expiresAt.toISOString());
              setPaymentSuccess(true);
              setShowPayPal(false);
              setLoadingPaypal(false);
            } catch {
              setPaymentError('Error al procesar el pago. Intenta de nuevo.');
              setLoadingPaypal(false);
            }
          },
          onError: () => {
            setPaymentError('Error en el pago. Intenta de nuevo.');
            setLoadingPaypal(false);
          },
          onCancel: () => {
            setLoadingPaypal(false);
            setShowPayPal(false);
          },
        }).render('#paypal-button-container');
        setLoadingPaypal(false);
      } catch {
        setPaymentError('Error al cargar PayPal. Recarga la página.');
        setLoadingPaypal(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [showPayPal, paypalReady, selectedPlan, setPremium]);

  const currentPremium = checkPremium();

  if (paymentSuccess) {
    return (
      <div className="py-16 sm:py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-3">{t('success.title')}</h1>
          <p className="text-text-secondary text-sm mb-2">{t('success.message')}</p>
          <p className="text-text-muted text-xs mb-8">
            {selectedPlan === 'annual' ? t('success.annualMsg') : t('success.monthlyMsg')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-xl hover:bg-accent-700 transition-all"
          >
            {t('success.cta')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="page-container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex p-2.5 rounded-xl bg-brand-50 text-brand-600 mb-4">
            <Crown className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-3">
            {currentPremium ? t('alreadyPremium') : t('title')}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            {currentPremium ? t('alreadyPremiumDesc') : t('subtitle')}
          </p>
        </div>

        {currentPremium && (
          <div className="max-w-md mx-auto mb-10 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl text-center">
            <Sparkles className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-green-800 mb-1">{t('activePremium')}</h2>
            <p className="text-sm text-green-600 mb-4">{t('activePremiumDesc')}</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all text-sm"
            >
              {t('goToConverter')}
            </button>
          </div>
        )}

        {!currentPremium && (
          <>
            {/* Billing toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center bg-surface-secondary rounded-xl p-1 border border-border">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-white text-text shadow-sm border border-border'
                      : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {t('billing.monthly')}
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    billingPeriod === 'annual'
                      ? 'bg-white text-text shadow-sm border border-border'
                      : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {t('billing.annual')}
                  <span className="ml-1.5 px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                    {t('billing.save')}
                  </span>
                </button>
              </div>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              {/* Free Plan */}
              <div className="card border border-border p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-text mb-1">{t('plans.free.name')}</h3>
                <p className="text-sm text-text-secondary mb-4">{t('plans.free.desc')}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-text">$0</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {(t('plans.free.features', { returnObjects: true }) as string[]).map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-text-muted text-center">{t('plans.free.cta')}</p>
              </div>

              {/* Premium Plan */}
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-md">
                    {t('plans.premium.badge')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{t('plans.premium.name')}</h3>
                <p className="text-sm text-blue-100 mb-4">{t('plans.premium.desc')}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">
                    ${billingPeriod === 'monthly' ? MONTHLY_PRICE.toFixed(2) : ANNUAL_PRICE.toFixed(2)}
                  </span>
                  <span className="text-blue-200 text-sm">
                    {' '}/{billingPeriod === 'monthly' ? t('billing.monthPrice') : t('billing.yearPrice')}
                  </span>
                  {billingPeriod === 'annual' && (
                    <p className="text-blue-200 text-xs mt-1">{t('billing.annualSaving')}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {(t('plans.premium.features', { returnObjects: true }) as string[]).map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                      <span className="text-blue-50">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setSelectedPlan(billingPeriod);
                    setShowPayPal(true);
                    setPaymentError(null);
                  }}
                  className="w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('plans.premium.cta')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* PayPal Checkout */}
        {showPayPal && !currentPremium && (
          <div className="max-w-sm mx-auto mb-12">
            <div className="card border-2 border-blue-200 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-2 text-center">{t('checkout.title')}</h3>
              <p className="text-sm text-text-secondary text-center mb-6">
                {t('checkout.' + selectedPlan)} — ${selectedPlan === 'monthly' ? MONTHLY_PRICE.toFixed(2) : ANNUAL_PRICE.toFixed(2)} USD
              </p>

              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                  <X className="w-4 h-4 shrink-0" />
                  {paymentError}
                </div>
              )}

              {loadingPaypal && (
                <div className="text-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-accent-500 mx-auto mb-2" />
                  <p className="text-sm text-text-muted">Cargando PayPal...</p>
                </div>
              )}

              <div id="paypal-button-container" className="min-h-[40px]" />

              <p className="text-xs text-text-muted text-center mt-4 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                {t('checkout.securePayment')}
              </p>

              <button
                onClick={() => { setShowPayPal(false); setPaymentError(null); }}
                className="w-full mt-3 py-2 text-sm text-text-muted hover:text-text transition-colors"
              >
                {t('checkout.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Features grid */}
        {!currentPremium && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            {[
              { icon: Shield, key: 'privacy' },
              { icon: Zap, key: 'unlimited' },
              { icon: FileImage, key: 'formats' },
              { icon: FileText, key: 'allTools' },
            ].map((item, i) => {
              const feat = t(`featuresGrid.${item.key}`, { returnObjects: true }) as { title: string; desc: string };
              const Icon = item.icon;
              return (
                <div key={i} className="card p-4 text-center">
                  <div className="inline-flex p-2 bg-brand-50 rounded-lg mb-3">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-text mb-1">{feat.title}</h4>
                  <p className="text-xs text-text-secondary">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-text text-center mb-6 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5" />
            {t('faq.title')}
          </h2>
          <div className="space-y-3">
            {(t('faq.questions', { returnObjects: true }) as Array<{ q: string; a: string }>).map(
              (faq: { q: string; a: string }, i: number) => (
                <div key={i} className="card border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-secondary transition-colors"
                  >
                    <span className="text-sm font-medium text-text">{faq.q}</span>
                    <HelpCircle className={`w-4 h-4 text-text-muted transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                  </button>
                  {faqOpen === i && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-text-secondary">{faq.a}</p>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

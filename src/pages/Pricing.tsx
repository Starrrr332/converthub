import { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Heart, Check, AlertCircle, CreditCard, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';

declare global {
  interface Window {
    paypal?: {
      Buttons?: (config: Record<string, unknown>) => { render: (sel: string) => void };
    };
  }
}

export function Pricing() {
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [paypalReady, setPaypalReady] = useState(false);
  const [loadingPaypal, setLoadingPaypal] = useState(false);
  const renderedRef = useRef(false);

  useEffect(() => {
    const check = () => {
      if (window.paypal?.Buttons) {
        setPaypalReady(true);
      } else {
        setTimeout(check, 300);
      }
    };
    check();
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    setPaymentSuccess(true);
    setShowPayPal(false);
  }, []);

  useEffect(() => {
    if (!showPayPal || !paypalReady) return;
    if (renderedRef.current) return;
    renderedRef.current = true;
    setLoadingPaypal(true);

    const tryRender = () => {
      if (!window.paypal?.Buttons) {
        setTimeout(tryRender, 300);
        return;
      }
      const container = document.getElementById('paypal-donation-btn');
      if (!container) return;
      while (container.firstChild) container.removeChild(container.firstChild);
      try {
        window.paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'donate' },
          createOrder: (_data: unknown, actions: Record<string, unknown>) => {
            return (actions.order as { create: (order: unknown) => Promise<string> }).create({
              purchase_units: [{ amount: { value: selectedAmount.toFixed(2) }, description: `Donacion a ConvertHub - $${selectedAmount} USD` }]
            });
          },
          onApprove: async (_data: unknown, actions: Record<string, unknown>) => {
            await (actions.order as { capture: () => Promise<unknown> }).capture();
            handlePaymentSuccess();
          },
          onError: () => {
            setPaymentError('Error en el pago. Intenta de nuevo.');
            setLoadingPaypal(false);
          },
          onCancel: () => setLoadingPaypal(false)
        }).render('#paypal-donation-btn');
        setLoadingPaypal(false);
      } catch {
        setPaymentError('Error al cargar PayPal. Recarga la pagina.');
        setLoadingPaypal(false);
      }
    };
    const timer = setTimeout(tryRender, 500);
    return () => clearTimeout(timer);
  }, [showPayPal, paypalReady, selectedAmount, handlePaymentSuccess]);

  if (paymentSuccess) {
    return (
      <div className="py-16 sm:py-20">
        <div className="max-w-sm mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-3">Gracias por tu donación</h1>
          <p className="text-text-secondary text-sm mb-8">Tu apoyo nos ayuda a mantener ConvertHub gratuito para todos.</p>
          <Button onClick={() => window.location.href = '/'}>Continuar usando ConvertHub</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="page-container">
        <div className="max-w-lg mx-auto text-center mb-10">
          <div className="inline-flex p-2.5 rounded-xl bg-brand-50 text-brand-600 mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-3">
            Todo es gratuito
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            ConvertHub es y será siempre gratuito. Si te sirvió, considera hacer una donación voluntaria.
          </p>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="card border-2 border-brand-100">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-text mb-1">Hacer una donación</h2>
              <p className="text-sm text-text-secondary">Elige el monto que desees. No hay mínimo.</p>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {[1, 3, 5, 10].map(amount => (
                <button key={amount} onClick={() => { setSelectedAmount(amount); setShowPayPal(false); renderedRef.current = false; }}
                  className={`p-3 rounded-lg border-2 font-bold text-sm transition-all ${
                    selectedAmount === amount ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-border hover:border-brand-200 text-text-secondary hover:text-text'
                  }`}>
                  ${amount}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-text-secondary mb-1">Otro monto (USD)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-text-muted text-sm">$</span>
                <input type="number" min="1" value={selectedAmount}
                  onChange={(e) => { setSelectedAmount(Math.max(1, Number(e.target.value))); setShowPayPal(false); renderedRef.current = false; }}
                  className="input-field" />
              </div>
            </div>

            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {paymentError}
              </div>
            )}

            <div className="min-h-[60px]">
              {!showPayPal ? (
                <Button onClick={() => { setShowPayPal(true); setPaymentError(null); }} className="w-full" size="lg">
                  <CreditCard className="w-4 h-4" />
                  Donar ${selectedAmount} USD
                </Button>
              ) : (
                <div>
                  {loadingPaypal && (
                    <div className="text-center py-4 text-sm text-text-muted">Cargando PayPal...</div>
                  )}
                  <div id="paypal-donation-btn" />
                  <button onClick={() => { setShowPayPal(false); renderedRef.current = false; }}
                    className="w-full mt-3 py-2 text-sm text-text-muted hover:text-text transition-colors">
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
              <Lock className="w-3 h-3" />
              Pago seguro procesado por PayPal
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
              <Shield className="w-3.5 h-3.5" /> Privacidad total
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
              <Check className="w-3.5 h-3.5" /> Sin límites
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
              <Check className="w-3.5 h-3.5" /> Todas las herramientas
            </span>
          </div>

          <h2 className="text-xl font-bold text-text mb-6">¿Qué incluye?</h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: '🔒', title: 'Privacidad total', desc: 'Tus archivos nunca salen de tu navegador' },
              { icon: '⚡', title: 'Sin límites', desc: 'Conversiones ilimitadas, archivos grandes' },
              { icon: '🎁', title: 'Todo incluido', desc: 'PDF, imágenes, audio, video y más' },
            ].map((item, i) => (
              <div key={i} className="card text-center">
                <p className="text-2xl mb-2">{item.icon}</p>
                <h3 className="font-semibold text-text text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

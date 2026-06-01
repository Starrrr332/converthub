import { useState, useEffect, useCallback, useRef } from 'react';
import { usePremiumStore } from '../store/premiumStore';
import { Shield, Heart, Check, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/Button';

declare global {
  interface Window {
    paypal?: {
      Buttons?: (config: Record<string, unknown>) => { render: (sel: string) => void };
    };
  }
}

export function Pricing() {
  const premium = usePremiumStore();
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
    premium.setSubscription('donation-' + Date.now(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());
    setPaymentSuccess(true);
    setShowPayPal(false);
  }, [premium]);

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

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      try {
        window.paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'donate' },
          createOrder: (_data: unknown, actions: Record<string, unknown>) => {
            return (actions.order as { create: (order: unknown) => Promise<string> }).create({
              purchase_units: [{
                amount: { value: selectedAmount.toFixed(2) },
                description: `Donacion a ConvertHub - $${selectedAmount} USD`
              }]
            });
          },
          onApprove: async (_data: unknown, actions: Record<string, unknown>) => {
            await (actions.order as { capture: () => Promise<unknown> }).capture();
            handlePaymentSuccess();
          },
          onError: (err: unknown) => {
            console.error('PayPal error:', err);
            setPaymentError('Error en el pago. Intenta de nuevo.');
            setLoadingPaypal(false);
          },
          onCancel: () => {
            setLoadingPaypal(false);
          }
        }).render('#paypal-donation-btn');
        setLoadingPaypal(false);
      } catch (e) {
        console.error('PayPal render error:', e);
        setPaymentError('Error al cargar PayPal. Recarga la pagina.');
        setLoadingPaypal(false);
      }
    };

    const timer = setTimeout(tryRender, 500);
    return () => clearTimeout(timer);
  }, [showPayPal, paypalReady, selectedAmount, handlePaymentSuccess]);

  if (paymentSuccess) {
    return (
      <div className="py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gracias por tu donacion!</h1>
          <p className="text-gray-600 mb-8">Tu apoyo nos ayuda a mantener ConvertHub gratuito para todos.</p>
          <Button onClick={() => window.location.href = '/'}>Continuar usando ConvertHub</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Todos los features son gratuitos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ConvertHub es y siempre sera gratuito. Si te sirvio, considera hacer una donacion para apoyar el desarrollo.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hacer una donacion</h2>
              <p className="text-gray-600 text-sm">Elige el monto que desees. No hay minimo.</p>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[1, 3, 5, 10].map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setShowPayPal(false);
                    renderedRef.current = false;
                  }}
                  className={`p-3 rounded-lg border-2 font-bold transition-all ${
                    selectedAmount === amount
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Otro monto (USD)</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  min="1"
                  value={selectedAmount}
                  onChange={(e) => {
                    setSelectedAmount(Math.max(1, Number(e.target.value)));
                    setShowPayPal(false);
                    renderedRef.current = false;
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{paymentError}</p>
              </div>
            )}

            <div className="min-h-[60px] mb-4">
              {!showPayPal ? (
                <Button
                  onClick={() => {
                    setShowPayPal(true);
                    setPaymentError(null);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Donar ${selectedAmount} USD
                </Button>
              ) : (
                <div>
                  {loadingPaypal && (
                    <div className="text-center p-4 text-sm text-gray-500">
                      Cargando PayPal...
                    </div>
                  )}
                  <div id="paypal-donation-btn" />
                  <button
                    onClick={() => {
                      setShowPayPal(false);
                      renderedRef.current = false;
                    }}
                    className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center">
              Pago seguro procesado por PayPal. Puedes donar desde cualquier pais.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            <span>100% gratuito. Sin anuncios. Sin limites.</span>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Que incluye?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="card text-center">
              <p className="text-2xl mb-2">&#x1F512;</p>
              <h3 className="font-semibold text-gray-900 mb-1">Privacidad total</h3>
              <p className="text-sm text-gray-600">Tus archivos nunca salen de tu navegador</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl mb-2">&#x26A1;</p>
              <h3 className="font-semibold text-gray-900 mb-1">Sin limites</h3>
              <p className="text-sm text-gray-600">Conversiones ilimitadas, archivos grandes</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl mb-2">&#x1F381;</p>
              <h3 className="font-semibold text-gray-900 mb-1">Todas las herramientas</h3>
              <p className="text-sm text-gray-600">PDF, imagenes, audio, spreadsheet y mas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

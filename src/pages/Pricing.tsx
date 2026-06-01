import { useState, useEffect, useCallback } from 'react';
import { usePremiumStore } from '../store/premiumStore';
import { Shield, Heart, Check, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Pricing() {
  const premium = usePremiumStore();
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(5);

  const handlePaymentSuccess = useCallback(() => {
    premium.setSubscription('donation-' + Date.now(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());
    setPaymentSuccess(true);
    setShowPayPal(false);
  }, [premium]);

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

      const container = document.getElementById('paypal-donation-btn');
      if (!container || destroyed) return;

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'donate' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createOrder: (_data: unknown, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: selectedAmount.toFixed(2) },
              description: `Donación a ConvertHub - $${selectedAmount} USD`
            }]
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onApprove: async (_data: any, actions: any) => {
          await actions.order.capture();
          handlePaymentSuccess();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          console.error('PayPal error:', err);
          setPaymentError(err?.message || 'Error en el pago. Intenta de nuevo.');
        },
        onCancel: () => {
          console.log('Donation cancelled');
        }
      }).render('#paypal-donation-btn');
    };

    const timer = setTimeout(loadButtons, 500);
    return () => { destroyed = true; clearTimeout(timer); };
  }, [showPayPal, selectedAmount, handlePaymentSuccess]);

  if (paymentSuccess) {
    return (
      <div className="py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Gracias por tu donación!</h1>
          <p className="text-gray-600 mb-8">Tu apoyo nos ayuda a mantener ConvertHub gratuito para todos.</p>
          <Button onClick={() => window.location.href = '/converter/image'}>Continuar usando ConvertHub</Button>
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
            ConvertHub es y siempre será gratuito. Si te sirvió, considera hacer una donación para apoyar el desarrollo.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hacer una donación</h2>
              <p className="text-gray-600 text-sm">Elige el monto que desees. No hay mínimo.</p>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[1, 3, 5, 10].map(amount => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
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
                  onChange={(e) => setSelectedAmount(Math.max(1, Number(e.target.value)))}
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
              <div id="paypal-donation-btn" />
              {!showPayPal && (
                <Button
                  onClick={() => setShowPayPal(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Donar ${selectedAmount} USD
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center">
              Pago seguro procesado por PayPal. Puedes donar desde cualquier país.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            <span>100% gratuito. Sin anuncios. Sin límites.</span>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">¿Qué incluye?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="card text-center">
              <p className="text-2xl mb-2">&#x1F512;</p>
              <h3 className="font-semibold text-gray-900 mb-1">Privacidad total</h3>
              <p className="text-sm text-gray-600">Tus archivos nunca salen de tu navegador</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl mb-2">&#x26A1;</p>
              <h3 className="font-semibold text-gray-900 mb-1">Sin límites</h3>
              <p className="text-sm text-gray-600">Conversiones ilimitadas, archivos grandes</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl mb-2">&#x1F381;</p>
              <h3 className="font-semibold text-gray-900 mb-1">Todas las herramientas</h3>
              <p className="text-sm text-gray-600">PDF, imágenes, audio, spreadsheet y más</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

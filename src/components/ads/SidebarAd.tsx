import { useEffect, useState } from 'react';
import { ShoppingCart, ExternalLink, Sparkles } from 'lucide-react';

interface AmazonProduct {
  asin: string;
  title: string;
  price: number | null;
  currency: string;
  image_url: string | null;
  affiliate_url: string;
  rating: number | null;
  review_count: number | null;
  category: string;
}

interface SidebarAdProps {
  side: 'left' | 'right';
}

let cachedProducts: AmazonProduct[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 60;

function getRandomProduct(products: AmazonProduct[]): AmazonProduct {
  return products[Math.floor(Math.random() * products.length)];
}

export function SidebarAd({ side }: SidebarAdProps) {
  const [product, setProduct] = useState<AmazonProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      if (cachedProducts && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setProduct(getRandomProduct(cachedProducts));
        setLoading(false);
        return;
      }
      fetch('/amazon-products.json')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load');
          return res.json();
        })
        .then((data) => {
          const products: AmazonProduct[] = data.products || [];
          if (products.length > 0) {
            cachedProducts = products;
            cacheTimestamp = Date.now();
            setProduct(getRandomProduct(products));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={`hidden xl:block w-48 flex-shrink-0 ${side === 'left' ? 'mr-4' : 'ml-4'}`}>
        <div className="sticky top-24 w-full min-h-[400px] rounded-xl bg-gradient-to-b from-amber-50/30 to-orange-50/30 dark:from-amber-900/5 dark:to-orange-900/5 border border-amber-200/20 dark:border-amber-700/10 animate-pulse" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className={`hidden xl:block w-48 flex-shrink-0 ${side === 'left' ? 'mr-4' : 'ml-4'}`}>
      <div className="sticky top-24 w-full">
        <a
          href={product.affiliate_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group block w-full rounded-xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-700/30 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          {/* Ad label */}
          <div className="flex items-center justify-center gap-1 px-2 py-1.5 bg-amber-100/50 dark:bg-amber-800/20 border-b border-amber-200/30 dark:border-amber-700/30">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Publicidad
            </span>
          </div>

          {/* Product image */}
          <div className="aspect-square bg-white dark:bg-gray-800 flex items-center justify-center p-4">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <ShoppingCart className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white leading-snug line-clamp-3 mb-2">
              {product.title}
            </h4>

            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-2.5 h-2.5 ${star <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-600 fill-gray-200 dark:fill-gray-600'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}

            {product.price ? (
              <div className="text-base font-bold text-green-600 dark:text-green-400 mb-2">
                ${product.price.toFixed(2)}
              </div>
            ) : (
              <div className="text-xs text-gray-400 mb-2">Ver precio</div>
            )}

            <span className="flex items-center justify-center gap-1 w-full px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
              <ShoppingCart className="w-3 h-3" />
              Comprar
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}

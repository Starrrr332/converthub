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

interface AmazonAdColumnProps {
  className?: string;
}

let cachedProducts: AmazonProduct[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function AmazonAdColumn({ className = '' }: AmazonAdColumnProps) {
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try cache first
    if (cachedProducts && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setProducts(shuffleArray(cachedProducts).slice(0, 3));
      setLoading(false);
      return;
    }

    // Fetch fresh data
    fetch('/amazon-products.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => {
        const allProducts: AmazonProduct[] = data.products || [];
        if (allProducts.length > 0) {
          cachedProducts = allProducts;
          cacheTimestamp = Date.now();
          setProducts(shuffleArray(allProducts).slice(0, 3));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 gap-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="min-h-[320px] rounded-xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-700/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
      {/* Encabezado de publicidad */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50/80 dark:bg-amber-900/10 rounded-lg border border-amber-200/40 dark:border-amber-700/30">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
          Productos Recomendados en Amazon
        </span>
        <span className="ml-auto text-[10px] text-amber-400 dark:text-amber-500">Publicidad</span>
      </div>

      {/* 3 banners verticales */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product, index) => (
          <VerticalAdCard key={product.asin} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}

function VerticalAdCard({ product, index }: { product: AmazonProduct; index: number }) {
  const [imgError, setImgError] = useState(false);

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-200 dark:text-gray-600 fill-gray-200 dark:fill-gray-600'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">
          {product.rating?.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <a
      href={product.affiliate_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group bg-white dark:bg-gray-800 rounded-xl border border-amber-200/50 dark:border-amber-700/30 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Imagen - vertical / cuadrada */}
      <div className="relative aspect-[3/4] bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}
        {/* Badge de numero */}
        <div className="absolute top-2 left-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
          {index + 1}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2">
          {product.title}
        </h4>

        {product.rating && <div className="mb-2">{renderStars(product.rating)}</div>}

        <div className="flex-1" />

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          {product.price ? (
            <span className="text-base font-bold text-green-600 dark:text-green-400">
              ${product.price.toFixed(2)}
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">Ver precio</span>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
            <ShoppingCart className="w-3 h-3" />
            Comprar
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

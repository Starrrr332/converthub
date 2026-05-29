import { usePremiumStore } from '../../store/premiumStore';

interface AdBannerProps {
  position: 'top' | 'sidebar' | 'bottom';
}

export function AdBanner({ position }: AdBannerProps) {
  const { isPremium } = usePremiumStore();
  
  // Don't show ads to premium users
  if (isPremium()) return null;
  
  const styles: Record<string, string> = {
    top: 'w-full h-[90px] mb-6',
    sidebar: 'w-[300px] h-[250px]',
    bottom: 'w-full h-[90px] mt-6'
  };
  
  return (
    <div className={`ad-container ${styles[position]} flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200`}>
      {/* Ezoic ad placeholder - will be filled by Ezoic script */}
      <div id={`ezoic-pub-ad-placeholder-${position}`} className="w-full h-full">
        <span className="text-xs text-gray-400">Publicidad</span>
      </div>
    </div>
  );
}

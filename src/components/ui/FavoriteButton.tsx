import { Star } from 'lucide-react';
import { useCommandStore } from '../../store/commandStore';

interface FavoriteButtonProps {
  path: string;
  className?: string;
}

export function FavoriteButton({ path, className = '' }: FavoriteButtonProps) {
  const { favorites, addFavorite, removeFavorite } = useCommandStore();
  const isFav = favorites.includes(path);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(path);
    } else {
      addFavorite(path);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-lg transition-colors ${
        isFav
          ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50'
          : 'text-text-muted hover:text-yellow-500 hover:bg-yellow-50'
      } ${className}`}
      title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
}

import { useState, useMemo } from 'react';
import { Search, Copy, Check } from 'lucide-react';

interface Emoji {
  char: string;
  name: string;
  category: string;
}

const EMOJIS: Emoji[] = [
  { char: '😀', name: 'grinning face', category: 'caras' },
  { char: '😃', name: 'smiley', category: 'caras' },
  { char: '😄', name: 'smile', category: 'caras' },
  { char: '😁', name: 'grin', category: 'caras' },
  { char: '😆', name: 'laughing', category: 'caras' },
  { char: '😅', name: 'sweat smile', category: 'caras' },
  { char: '🤣', name: 'rofl', category: 'caras' },
  { char: '😂', name: 'joy', category: 'caras' },
  { char: '🙂', name: 'slightly smiling', category: 'caras' },
  { char: '😉', name: 'wink', category: 'caras' },
  { char: '😊', name: 'blush', category: 'caras' },
  { char: '😇', name: 'innocent', category: 'caras' },
  { char: '🥰', name: 'hearts face', category: 'caras' },
  { char: '😍', name: 'heart eyes', category: 'caras' },
  { char: '🤩', name: 'star struck', category: 'caras' },
  { char: '😘', name: 'kiss', category: 'caras' },
  { char: '😎', name: 'sunglasses', category: 'caras' },
  { char: '🤓', name: 'nerd', category: 'caras' },
  { char: '🤔', name: 'thinking', category: 'caras' },
  { char: '🤗', name: 'hugs', category: 'caras' },
  { char: '👍', name: 'thumbs up', category: 'manos' },
  { char: '👎', name: 'thumbs down', category: 'manos' },
  { char: '👏', name: 'clap', category: 'manos' },
  { char: '🙌', name: 'raised hands', category: 'manos' },
  { char: '🤝', name: 'handshake', category: 'manos' },
  { char: '🙏', name: 'pray', category: 'manos' },
  { char: '✌️', name: 'victory', category: 'manos' },
  { char: '🤞', name: 'crossed fingers', category: 'manos' },
  { char: '💪', name: 'muscle', category: 'manos' },
  { char: '❤️', name: 'red heart', category: 'simbolos' },
  { char: '🧡', name: 'orange heart', category: 'simbolos' },
  { char: '💛', name: 'yellow heart', category: 'simbolos' },
  { char: '💚', name: 'green heart', category: 'simbolos' },
  { char: '💙', name: 'blue heart', category: 'simbolos' },
  { char: '💜', name: 'purple heart', category: 'simbolos' },
  { char: '🖤', name: 'black heart', category: 'simbolos' },
  { char: '⭐', name: 'star', category: 'simbolos' },
  { char: '🔥', name: 'fire', category: 'simbolos' },
  { char: '✨', name: 'sparkles', category: 'simbolos' },
  { char: '💯', name: 'hundred', category: 'simbolos' },
  { char: '🎉', name: 'party', category: 'simbolos' },
  { char: '🎊', name: 'confetti', category: 'simbolos' },
  { char: '🐶', name: 'dog', category: 'animales' },
  { char: '🐱', name: 'cat', category: 'animales' },
  { char: '🐭', name: 'mouse', category: 'animales' },
  { char: '🐹', name: 'hamster', category: 'animales' },
  { char: '🐰', name: 'rabbit', category: 'animales' },
  { char: '🦊', name: 'fox', category: 'animales' },
  { char: '🐻', name: 'bear', category: 'animales' },
  { char: '🐼', name: 'panda', category: 'animales' },
  { char: '🐨', name: 'koala', category: 'animales' },
  { char: '🦁', name: 'lion', category: 'animales' },
  { char: '🍎', name: 'apple', category: 'comida' },
  { char: '🍕', name: 'pizza', category: 'comida' },
  { char: '🍔', name: 'burger', category: 'comida' },
  { char: '🍟', name: 'fries', category: 'comida' },
  { char: '🌮', name: 'taco', category: 'comida' },
  { char: '🍣', name: 'sushi', category: 'comida' },
  { char: '🍩', name: 'donut', category: 'comida' },
  { char: '🎂', name: 'cake', category: 'comida' },
  { char: '☕', name: 'coffee', category: 'comida' },
  { char: '🍺', name: 'beer', category: 'comida' },
  { char: '🚗', name: 'car', category: 'objetos' },
  { char: '✈️', name: 'airplane', category: 'objetos' },
  { char: '🏠', name: 'house', category: 'objetos' },
  { char: '💻', name: 'laptop', category: 'objetos' },
  { char: '📱', name: 'phone', category: 'objetos' },
  { char: '📷', name: 'camera', category: 'objetos' },
  { char: '🎮', name: 'game', category: 'objetos' },
  { char: '📚', name: 'books', category: 'objetos' },
  { char: '🎵', name: 'music', category: 'objetos' },
  { char: '⏰', name: 'alarm', category: 'objetos' },
];

const CATEGORIES = [...new Set(EMOJIS.map((e) => e.category))];

export function EmojiConverter() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);

  const filtered = useMemo(() => {
    return EMOJIS.filter((e) => {
      const matchSearch =
        !search || e.name.includes(search.toLowerCase()) || e.char.includes(search);
      const matchCategory = !selectedCategory || e.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const copyEmoji = async (emoji: Emoji, type: 'char' | 'unicode' | 'html') => {
    let text: string;
    if (type === 'char') text = emoji.char;
    else if (type === 'unicode')
      text = `U+${emoji.char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;
    else text = `&#${emoji.char.codePointAt(0)};`;

    await navigator.clipboard.writeText(text);
    setCopied(`${emoji.char}-${type}`);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Convertidor de Emoji</h3>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar emoji..."
          className="input-field pl-10 w-full"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            !selectedCategory
              ? 'bg-brand-600 text-white'
              : 'bg-surface-secondary text-text-secondary hover:bg-slate-200'
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white'
                : 'bg-surface-secondary text-text-secondary hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1 mb-4">
        {filtered.map((emoji) => (
          <button
            key={emoji.char}
            onClick={() => setSelectedEmoji(emoji)}
            className={`p-2 rounded-lg text-2xl hover:bg-surface-secondary transition-colors ${
              selectedEmoji?.char === emoji.char ? 'bg-brand-50 ring-2 ring-brand-400' : ''
            }`}
            title={emoji.name}
          >
            {emoji.char}
          </button>
        ))}
      </div>

      {/* Selected emoji details */}
      {selectedEmoji && (
        <div className="card p-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{selectedEmoji.char}</span>
            <div>
              <p className="font-medium text-text capitalize">{selectedEmoji.name}</p>
              <p className="text-xs text-text-muted capitalize">{selectedEmoji.category}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { type: 'char' as const, label: 'Copiar emoji', value: selectedEmoji.char },
              {
                type: 'unicode' as const,
                label: 'Unicode',
                value: `U+${selectedEmoji.char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`,
              },
              {
                type: 'html' as const,
                label: 'HTML entity',
                value: `&#${selectedEmoji.char.codePointAt(0)};`,
              },
            ].map((opt) => (
              <button
                key={opt.type}
                onClick={() => copyEmoji(selectedEmoji, opt.type)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-secondary hover:bg-slate-200 text-xs font-medium text-text-secondary transition-colors"
              >
                {copied === `${selectedEmoji.char}-${opt.type}` ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

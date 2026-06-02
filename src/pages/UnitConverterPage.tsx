import { useState, useMemo } from 'react';

type Category =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'volume'
  | 'speed'
  | 'area'
  | 'digital'
  | 'currency';

interface UnitDef {
  id: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const categories: Record<Category, { label: string; units: UnitDef[] }> = {
  length: {
    label: 'Longitud',
    units: [
      { id: 'm', label: 'Metros', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', label: 'Kilómetros', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', label: 'Centímetros', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', label: 'Milímetros', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mi', label: 'Millas', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'ft', label: 'Pies', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', label: 'Pulgadas', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'yd', label: 'Yardas', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'nmi', label: 'Millas náuticas', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
    ],
  },
  weight: {
    label: 'Peso',
    units: [
      { id: 'kg', label: 'Kilogramos', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', label: 'Gramos', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', label: 'Miligramos', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: 'lb', label: 'Libras', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { id: 'oz', label: 'Onzas', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: 't', label: 'Toneladas', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'st', label: 'Stones', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
    ],
  },
  temperature: {
    label: 'Temperatura',
    units: [
      { id: 'c', label: 'Celsius', toBase: (v) => v, fromBase: (v) => v },
      {
        id: 'f',
        label: 'Fahrenheit',
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      { id: 'k', label: 'Kelvin', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  volume: {
    label: 'Volumen',
    units: [
      { id: 'l', label: 'Litros', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ml', label: 'Mililitros', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      {
        id: 'gal',
        label: 'Galones (US)',
        toBase: (v) => v * 3.78541,
        fromBase: (v) => v / 3.78541,
      },
      { id: 'qt', label: 'Cuartos', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { id: 'pt', label: 'Pintas', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      { id: 'cup', label: 'Tazas', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      {
        id: 'floz',
        label: 'Onzas líquidas',
        toBase: (v) => v * 0.0295735,
        fromBase: (v) => v / 0.0295735,
      },
      { id: 'm3', label: 'Metros cúbicos', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  speed: {
    label: 'Velocidad',
    units: [
      { id: 'kmh', label: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', label: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'ms', label: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'knot', label: 'Nudos', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      {
        id: 'c',
        label: 'Velocidad luz',
        toBase: (v) => v * 299792458,
        fromBase: (v) => v / 299792458,
      },
    ],
  },
  area: {
    label: 'Área',
    units: [
      { id: 'm2', label: 'Metros²', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km2', label: 'Kilómetros²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { id: 'ha', label: 'Hectáreas', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { id: 'ft2', label: 'Pies²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: 'ac', label: 'Acres', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    ],
  },
  digital: {
    label: 'Almacenamiento',
    units: [
      { id: 'b', label: 'Bytes', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kb', label: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'mb', label: 'MB', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      { id: 'gb', label: 'GB', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      {
        id: 'tb',
        label: 'TB',
        toBase: (v) => v * 1099511627776,
        fromBase: (v) => v / 1099511627776,
      },
    ],
  },
  currency: {
    label: 'Moneda (aproximado)',
    units: [
      { id: 'usd', label: 'USD $', toBase: (v) => v, fromBase: (v) => v },
      { id: 'eur', label: 'EUR €', toBase: (v) => v * 1.08, fromBase: (v) => v / 1.08 },
      { id: 'gbp', label: 'GBP £', toBase: (v) => v * 1.27, fromBase: (v) => v / 1.27 },
      { id: 'jpy', label: 'JPY ¥', toBase: (v) => v * 0.0067, fromBase: (v) => v / 0.0067 },
      { id: 'mxn', label: 'MXN $', toBase: (v) => v * 0.055, fromBase: (v) => v / 0.055 },
      { id: 'brl', label: 'BRL R$', toBase: (v) => v * 0.19, fromBase: (v) => v / 0.19 },
      { id: 'ars', label: 'ARS $', toBase: (v) => v * 0.0011, fromBase: (v) => v / 0.0011 },
    ],
  },
};

export function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('1');

  const cat = categories[category];

  const resolvedFrom = fromUnit || cat.units[0]?.id || '';
  const resolvedTo = toUnit || (cat.units.length > 1 ? cat.units[1].id : cat.units[0]?.id || '');

  const result = useMemo(() => {
    const from = cat.units.find((u) => u.id === resolvedFrom);
    const to = cat.units.find((u) => u.id === resolvedTo);
    if (!from || !to || !value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    const base = from.toBase(num);
    const converted = to.fromBase(base);
    return converted.toLocaleString(undefined, { maximumSignificantDigits: 12 });
  }, [cat.units, resolvedFrom, resolvedTo, value]);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    const newCat = categories[newCategory];
    setFromUnit(newCat.units[0]?.id || '');
    setToUnit(newCat.units.length > 1 ? newCat.units[1].id : newCat.units[0]?.id || '');
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit Converter</h1>
          <p className="text-gray-600">Convierte unidades de medida al instante</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key as Category)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  category === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">De</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
                <select
                  value={resolvedFrom}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                >
                  {cat.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">A</label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-lg font-semibold">
                  {result}
                </div>
                <select
                  value={resolvedTo}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                >
                  {cat.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Referencia rápida</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {cat.units.slice(0, 6).map((u) => {
                const baseValue = resolvedFrom
                  ? cat.units
                      .find((uu) => uu.id === resolvedFrom)
                      ?.toBase(parseFloat(value || '1')) || 0
                  : 0;
                return (
                  <div key={u.id} className="flex justify-between p-1">
                    <span className="text-gray-500">{u.label}:</span>
                    <span className="font-medium">
                      {u
                        .fromBase(baseValue)
                        .toLocaleString(undefined, { maximumSignificantDigits: 6 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/layout/PageLayout';

interface Cell {
  value: string;
}

export function SpreadsheetEditorPage() {
  const { t } = useTranslation('common');
  const [data, setData] = useState<Cell[][]>([
    [{ value: 'Nombre' }, { value: 'Edad' }, { value: 'Ciudad' }],
    [{ value: 'Juan' }, { value: '25' }, { value: 'Madrid' }],
    [{ value: 'María' }, { value: '30' }, { value: 'Barcelona' }],
  ]);
  const [delimiter, setDelimiter] = useState(',');
  const [fileName, setFileName] = useState('data.csv');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCSV(content);
    };
    reader.readAsText(file);
  };

  const parseCSV = (content: string) => {
    const lines = content.split('\n').filter((l) => l.trim());
    const parsed = lines.map((line) => {
      const cells = line.split(delimiter);
      return cells.map((cell) => ({ value: cell.replace(/^"|"$/g, '').trim() }));
    });
    setData(parsed);
  };

  const updateCell = (row: number, col: number, value: string) => {
    const newData = [...data];
    newData[row] = [...newData[row]];
    newData[row][col] = { value };
    setData(newData);
  };

  const addRow = (afterRow: number) => {
    const cols = data[0]?.length || 3;
    const newRow: Cell[] = Array(cols)
      .fill(null)
      .map(() => ({ value: '' }));
    const newData = [...data];
    newData.splice(afterRow + 1, 0, newRow);
    setData(newData);
  };

  const deleteRow = (rowIndex: number) => {
    if (data.length <= 1) return;
    setData(data.filter((_, i) => i !== rowIndex));
  };

  const moveRow = (rowIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1;
    if (newIndex < 0 || newIndex >= data.length) return;
    const newData = [...data];
    [newData[rowIndex], newData[newIndex]] = [newData[newIndex], newData[rowIndex]];
    setData(newData);
  };

  const addColumn = (afterCol: number) => {
    const newData = data.map((row) => {
      const newRow = [...row];
      newRow.splice(afterCol + 1, 0, { value: '' });
      return newRow;
    });
    setData(newData);
  };

  const deleteCol = (colIndex: number) => {
    if (data[0]?.length <= 1) return;
    setData(data.map((row) => row.filter((_, i) => i !== colIndex)));
  };

  const exportCSV = () => {
    const content = data
      .map((row) => row.map((cell) => `"${cell.value}"`).join(delimiter))
      .join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (data.length < 2) return;
    const headers = data[0].map((cell) => cell.value);
    const jsonData = data.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = row[i]?.value || '';
      });
      return obj;
    });
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.\w+$/, '.json');
    a.click();
    URL.revokeObjectURL(url);
  };

  const sortColumn = (colIndex: number, ascending: boolean) => {
    const header = data[0];
    const rows = data.slice(1);
    rows.sort((a, b) => {
      const aVal = a[colIndex]?.value || '';
      const bVal = b[colIndex]?.value || '';
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return ascending ? aNum - bNum : bNum - aNum;
      }
      return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    setData([header, ...rows]);
  };

  return (
    <PageLayout
      wide
      title={t('nav.editors.spreadsheet')}
      subtitle={t('nav.editors.spreadsheetDesc')}
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.editors.spreadsheet') }]}
    >
      <div className="content-panel p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".csv,.tsv,.txt"
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" /> Abrir CSV
          </Button>
          <Button onClick={exportCSV} size="sm">
            <Download className="w-4 h-4 mr-1" /> Exportar CSV
          </Button>
          <Button onClick={exportJSON} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" /> Exportar JSON
          </Button>
          <Button onClick={() => addRow(data.length - 1)} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Fila
          </Button>
          <Button onClick={() => addColumn((data[0]?.length || 1) - 1)} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Columna
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-600">Delimitador:</label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="p-1 border rounded text-sm"
            >
              <option value=",">Coma (,)</option>
              <option value=";">Punto y coma (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 bg-gray-100 border text-sm font-medium text-gray-600 w-12">#</th>
                {data[0]?.map((_, colIndex) => (
                  <th
                    key={colIndex}
                    className="p-2 bg-gray-100 border text-sm font-medium text-gray-600 min-w-[120px]"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>Col {colIndex + 1}</span>
                      <div className="flex gap-0.5">
                        <button
                          onClick={() => sortColumn(colIndex, true)}
                          className="hover:bg-gray-200 p-0.5 rounded"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => sortColumn(colIndex, false)}
                          className="hover:bg-gray-200 p-0.5 rounded"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteCol(colIndex)}
                          className="hover:bg-red-100 p-0.5 rounded text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="p-2 bg-gray-100 border w-20">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex === 0 ? 'bg-blue-50' : ''}>
                  <td className="p-2 border text-sm text-gray-500 text-center">{rowIndex + 1}</td>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="p-0 border">
                      <input
                        type="text"
                        value={cell.value}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        className={`w-full p-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                          rowIndex === 0 ? 'font-semibold' : ''
                        }`}
                      />
                    </td>
                  ))}
                  <td className="p-1 border">
                    <div className="flex gap-0.5 justify-center">
                      <button
                        onClick={() => moveRow(rowIndex, 'up')}
                        disabled={rowIndex === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveRow(rowIndex, 'down')}
                        disabled={rowIndex === data.length - 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => addRow(rowIndex)}
                        className="p-1 hover:bg-green-100 rounded text-green-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500 text-center">
        {data.length} filas × {data[0]?.length || 0} columnas
      </div>
    </PageLayout>
  );
}

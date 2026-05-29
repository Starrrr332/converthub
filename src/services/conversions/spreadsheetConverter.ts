import * as XLSX from 'xlsx';
import type { 
  SpreadsheetConvertOptions, 
  SpreadsheetPreviewResult, 
  SpreadsheetConversionResult 
} from '../../types';

// ==================== CSV TO XLSX ====================

export async function csvToXlsx(options: SpreadsheetConvertOptions): Promise<SpreadsheetConversionResult> {
  const text = await options.file.text();
  const workbook = XLSX.read(text, { type: 'string' });
  const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([xlsxBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  const url = URL.createObjectURL(blob);
  
  const baseName = options.file.name.replace(/\.[^/.]+$/, '');
  
  return {
    blob,
    url,
    filename: `${baseName}.xlsx`,
    size: blob.size
  };
}

// ==================== XLSX TO CSV ====================

export async function xlsxToCsv(options: SpreadsheetConvertOptions): Promise<SpreadsheetConversionResult> {
  const buffer = await options.file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = options.sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const csvContent = XLSX.utils.sheet_to_csv(worksheet, {
    FS: options.delimiter || ','
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const baseName = options.file.name.replace(/\.[^/.]+$/, '');
  
  return {
    blob,
    url,
    filename: `${baseName}.csv`,
    size: blob.size
  };
}

// ==================== CSV TO JSON ====================

export async function csvToJson(options: SpreadsheetConvertOptions): Promise<SpreadsheetConversionResult> {
  const text = await options.file.text();
  const workbook = XLSX.read(text, { type: 'string' });
  const sheetName = options.sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    raw: false,
    dateNF: 'yyyy-mm-dd'
  });
  
  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const baseName = options.file.name.replace(/\.[^/.]+$/, '');
  
  return {
    blob,
    url,
    filename: `${baseName}.json`,
    size: blob.size
  };
}

// ==================== JSON TO CSV ====================

export async function jsonToCsv(options: SpreadsheetConvertOptions): Promise<SpreadsheetConversionResult> {
  const text = await options.file.text();
  const jsonData = JSON.parse(text);
  
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error('Invalid JSON: expected an array of objects');
  }
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  const csvContent = XLSX.utils.sheet_to_csv(worksheet, {
    FS: options.delimiter || ','
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const baseName = options.file.name.replace(/\.[^/.]+$/, '');
  
  return {
    blob,
    url,
    filename: `${baseName}.csv`,
    size: blob.size
  };
}

// ==================== PREVIEW ====================

export async function previewSpreadsheet(file: File): Promise<SpreadsheetPreviewResult> {
  let workbook: XLSX.WorkBook;
  
  if (file.type === 'application/json') {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  } else if (file.type === 'text/csv') {
    const text = await file.text();
    workbook = XLSX.read(text, { type: 'string' });
  } else {
    const buffer = await file.arrayBuffer();
    workbook = XLSX.read(buffer, { type: 'array' });
  }
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (jsonData.length === 0) {
    return {
      headers: [],
      rows: [],
      totalRows: 0,
      sheetName
    };
  }
  
  const headers = (jsonData[0] as string[]).map(String);
  const rows = jsonData.slice(1).map((row) => 
    (row as unknown[]).map(String)
  );
  
  return {
    headers,
    rows: rows.slice(0, 100), // Limit to first 100 rows for preview
    totalRows: rows.length,
    sheetName
  };
}

// ==================== VALIDATION ====================

export function validateSpreadsheetFile(file: File): boolean {
  const validTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json'
  ];
  
  const validExtensions = ['.csv', '.xls', '.xlsx', '.json'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
  return validTypes.includes(file.type) || validExtensions.includes(ext);
}

export function getFileFormat(file: File): 'csv' | 'xlsx' | 'json' {
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
  if (ext === '.csv') return 'csv';
  if (ext === '.json') return 'json';
  return 'xlsx';
}

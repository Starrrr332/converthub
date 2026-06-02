import { lazy } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Image, FileText, Table, Music, Film,
  Edit3, Type, Braces, Code, FileSpreadsheet,
  Wrench, Ruler, Cpu, ScanText, ImageDown, FileSearch2,
  Lock, Calculator, Smile, FileJson, Palette, Paintbrush,
  Binary, Link, Hash, QrCode, Database, FileDiff, Regex, Key, FileCode, Scan,
  Camera, Terminal, BarChart3, Sigma, Clock,
  BookOpen, Smartphone, Grid3X3,
} from 'lucide-react';

export type ToolCategory = 'converter' | 'editor' | 'tool' | 'devtool' | 'utility';

export interface ToolDefinition {
  path: string;
  icon: LucideIcon;
  name: string;
  labelKey: string;
  descKey: string;
  homeDesc?: string;
  category: ToolCategory;
  subCategory?: string;
  featured?: boolean;
  color: string;
  bg: string;
  hover: string;
  component: React.LazyExoticComponent<React.ComponentType>;
}

// Lazy-loaded page components
const ImageConverter = lazy(() => import('../pages/Converter').then(m => ({ default: m.Converter })));
const PdfConverter = lazy(() => import('../pages/PdfConverter').then(m => ({ default: m.PdfConverter })));
const SpreadsheetConverter = lazy(() => import('../pages/SpreadsheetConverter').then(m => ({ default: m.SpreadsheetConverter })));
const AudioConverter = lazy(() => import('../pages/AudioConverter').then(m => ({ default: m.AudioConverter })));
const VideoConverterPage = lazy(() => import('../pages/VideoConverterPage').then(m => ({ default: m.VideoConverterPage })));
const ImageEditorPage = lazy(() => import('../pages/ImageEditorPage').then(m => ({ default: m.ImageEditorPage })));
const TextEditorPage = lazy(() => import('../pages/TextEditorPage').then(m => ({ default: m.TextEditorPage })));
const JsonFormatterPage = lazy(() => import('../pages/JsonFormatterPage').then(m => ({ default: m.JsonFormatterPage })));
const MarkdownEditorPage = lazy(() => import('../pages/MarkdownEditorPage').then(m => ({ default: m.MarkdownEditorPage })));
const SpreadsheetEditorPage = lazy(() => import('../pages/SpreadsheetEditorPage').then(m => ({ default: m.SpreadsheetEditorPage })));
const UnitConverterPage = lazy(() => import('../pages/UnitConverterPage').then(m => ({ default: m.UnitConverterPage })));
const OcrPage = lazy(() => import('../pages/OcrPage').then(m => ({ default: m.OcrPage })));
const ImageCompressorPage = lazy(() => import('../pages/ImageCompressorPage').then(m => ({ default: m.ImageCompressorPage })));
const FileAnalyzerPage = lazy(() => import('../pages/FileAnalyzerPage').then(m => ({ default: m.FileAnalyzerPage })));
const DevToolsPage = lazy(() => import('../pages/DevToolsPage').then(m => ({ default: m.DevToolsPage })));
const UtilitiesPage = lazy(() => import('../pages/UtilitiesPage').then(m => ({ default: m.UtilitiesPage })));

// New tools (Fase 3-4)
const FileEncryptorPage = lazy(() => import('../pages/tools/FileEncryptorPage').then(m => ({ default: m.FileEncryptorPage })));
const ExpressionCalcPage = lazy(() => import('../pages/tools/ExpressionCalcPage').then(m => ({ default: m.ExpressionCalcPage })));
const EmojiConverterPage = lazy(() => import('../pages/tools/EmojiConverterPage').then(m => ({ default: m.EmojiConverterPage })));
const JsonToTsPage = lazy(() => import('../pages/tools/JsonToTsPage').then(m => ({ default: m.JsonToTsPage })));
const YamlJsonPage = lazy(() => import('../pages/tools/YamlJsonPage').then(m => ({ default: m.YamlJsonPage })));
const GradientPage = lazy(() => import('../pages/tools/GradientPage').then(m => ({ default: m.GradientPage })));
const ColorPalettePage = lazy(() => import('../pages/tools/ColorPalettePage').then(m => ({ default: m.ColorPalettePage })));

// Sprint 2 tools
const EpubConverterPage = lazy(() => import('../pages/tools/EpubConverterPage').then(m => ({ default: m.EpubConverterPage })));
const HeicConverterPage = lazy(() => import('../pages/tools/HeicConverterPage').then(m => ({ default: m.HeicConverterPage })));
const MdToPdfPage = lazy(() => import('../pages/tools/MdToPdfPage').then(m => ({ default: m.MdToPdfPage })));
const JsonToSqlPage = lazy(() => import('../pages/tools/JsonToSqlPage').then(m => ({ default: m.JsonToSqlPage })));
const CollageMakerPage = lazy(() => import('../pages/tools/CollageMakerPage').then(m => ({ default: m.CollageMakerPage })));

// DevTools (individual pages)
const Base64Page = lazy(() => import('../pages/devtools/Base64Page').then(m => ({ default: m.Base64Page })));
const UrlEncoderPage = lazy(() => import('../pages/devtools/UrlEncoderPage').then(m => ({ default: m.UrlEncoderPage })));
const HashGeneratorPage = lazy(() => import('../pages/devtools/HashGeneratorPage').then(m => ({ default: m.HashGeneratorPage })));
const QrCodePage = lazy(() => import('../pages/devtools/QrCodePage').then(m => ({ default: m.QrCodePage })));
const QrScanPage = lazy(() => import('../pages/devtools/QrScanPage').then(m => ({ default: m.QrScanPage })));
const ColorConverterPage = lazy(() => import('../pages/devtools/ColorConverterPage').then(m => ({ default: m.ColorConverterPage })));
const SqlFormatterPage = lazy(() => import('../pages/devtools/SqlFormatterPage').then(m => ({ default: m.SqlFormatterPage })));
const DiffCheckerPage = lazy(() => import('../pages/devtools/DiffCheckerPage').then(m => ({ default: m.DiffCheckerPage })));
const RegexTesterPage = lazy(() => import('../pages/devtools/RegexTesterPage').then(m => ({ default: m.RegexTesterPage })));
const JwtDecoderPage = lazy(() => import('../pages/devtools/JwtDecoderPage').then(m => ({ default: m.JwtDecoderPage })));
const JsFormatterPage = lazy(() => import('../pages/devtools/JsFormatterPage').then(m => ({ default: m.JsFormatterPage })));

// Utilities (individual pages)
const PasswordGeneratorPage = lazy(() => import('../pages/utilities/PasswordGeneratorPage').then(m => ({ default: m.PasswordGeneratorPage })));
const LoremIpsumPage = lazy(() => import('../pages/utilities/LoremIpsumPage').then(m => ({ default: m.LoremIpsumPage })));
const UuidGeneratorPage = lazy(() => import('../pages/utilities/UuidGeneratorPage').then(m => ({ default: m.UuidGeneratorPage })));
const BarcodeGeneratorPage = lazy(() => import('../pages/utilities/BarcodeGeneratorPage').then(m => ({ default: m.BarcodeGeneratorPage })));
const CaseConverterPage = lazy(() => import('../pages/utilities/CaseConverterPage').then(m => ({ default: m.CaseConverterPage })));
const HtmlEntityPage = lazy(() => import('../pages/utilities/HtmlEntityPage').then(m => ({ default: m.HtmlEntityPage })));
const CronGeneratorPage = lazy(() => import('../pages/utilities/CronGeneratorPage').then(m => ({ default: m.CronGeneratorPage })));
const CssMinifierPage = lazy(() => import('../pages/utilities/CssMinifierPage').then(m => ({ default: m.CssMinifierPage })));
const Base64ImagePage = lazy(() => import('../pages/utilities/Base64ImagePage').then(m => ({ default: m.Base64ImagePage })));
const TextStatsPage = lazy(() => import('../pages/utilities/TextStatsPage').then(m => ({ default: m.TextStatsPage })));
const NumberBasePage = lazy(() => import('../pages/utilities/NumberBasePage').then(m => ({ default: m.NumberBasePage })));
const TimestampPage = lazy(() => import('../pages/utilities/TimestampPage').then(m => ({ default: m.TimestampPage })));

export const toolRegistry: ToolDefinition[] = [
  // ── Converters ──
  {
    path: '/converter/image',
    icon: Image,
    name: 'Imágenes',
    labelKey: 'nav.converters.image',
    descKey: 'nav.converters.imageDesc',
    homeDesc: 'PNG, JPG, WebP, GIF, SVG, ICO, AVIF, HEIC',
    category: 'converter',
    subCategory: 'image',
    featured: true,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-50 hover:border-blue-200',
    component: ImageConverter,
  },
  {
    path: '/converter/pdf',
    icon: FileText,
    name: 'PDF',
    labelKey: 'nav.converters.pdf',
    descKey: 'nav.converters.pdfDesc',
    homeDesc: 'Unir, dividir, comprimir, rotar, marca de agua',
    category: 'converter',
    subCategory: 'document',
    featured: true,
    color: 'text-red-600',
    bg: 'bg-red-50',
    hover: 'hover:bg-red-50 hover:border-red-200',
    component: PdfConverter,
  },
  {
    path: '/converter/csv',
    icon: Table,
    name: 'CSV / Excel',
    labelKey: 'nav.converters.csv',
    descKey: 'nav.converters.csvDesc',
    homeDesc: 'CSV a XLSX, XLSX a CSV, CSV a JSON',
    category: 'converter',
    subCategory: 'document',
    featured: true,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    hover: 'hover:bg-emerald-50 hover:border-emerald-200',
    component: SpreadsheetConverter,
  },
  {
    path: '/converter/audio',
    icon: Music,
    name: 'Audio',
    labelKey: 'nav.converters.audio',
    descKey: 'nav.converters.audioDesc',
    homeDesc: 'MP3, WAV, OGG, FLAC, AAC',
    category: 'converter',
    subCategory: 'audio',
    featured: true,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-50 hover:border-purple-200',
    component: AudioConverter,
  },
  {
    path: '/converter/video',
    icon: Film,
    name: 'Video',
    labelKey: 'nav.converters.video',
    descKey: 'nav.converters.videoDesc',
    homeDesc: 'Convertir, comprimir, recortar, extraer audio',
    category: 'converter',
    subCategory: 'video',
    featured: true,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    hover: 'hover:bg-orange-50 hover:border-orange-200',
    component: VideoConverterPage,
  },
  {
    path: '/converter/epub',
    icon: BookOpen,
    name: 'EPUB ↔ PDF',
    labelKey: 'nav.converters.epub',
    descKey: 'nav.converters.epubDesc',
    homeDesc: 'EPUB a PDF, PDF a EPUB',
    category: 'converter',
    subCategory: 'document',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    hover: 'hover:bg-rose-50 hover:border-rose-200',
    component: EpubConverterPage,
  },
  {
    path: '/converter/heic',
    icon: Smartphone,
    name: 'HEIC → JPG/PNG',
    labelKey: 'nav.converters.heic',
    descKey: 'nav.converters.heicDesc',
    homeDesc: 'Convertir HEIC de Apple a JPG o PNG',
    category: 'converter',
    subCategory: 'image',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    hover: 'hover:bg-cyan-50 hover:border-cyan-200',
    component: HeicConverterPage,
  },

  // ── Editors ──
  {
    path: '/editor/image',
    icon: Edit3,
    name: 'Editor de Imágenes',
    labelKey: 'nav.editors.image',
    descKey: 'nav.editors.imageDesc',
    homeDesc: 'Redimensionar, rotar, filtros, brillo, contraste',
    category: 'editor',
    featured: true,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    hover: 'hover:bg-pink-50 hover:border-pink-200',
    component: ImageEditorPage,
  },
  {
    path: '/editor/text',
    icon: Type,
    name: 'Editor de Texto',
    labelKey: 'nav.editors.text',
    descKey: 'nav.editors.textDesc',
    homeDesc: 'Notepad con búsqueda, reemplazo y estadísticas',
    category: 'editor',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    hover: 'hover:bg-sky-50 hover:border-sky-200',
    component: TextEditorPage,
  },
  {
    path: '/editor/json',
    icon: Braces,
    name: 'JSON Formatter',
    labelKey: 'nav.editors.json',
    descKey: 'nav.editors.jsonDesc',
    homeDesc: 'Formatear, minificar, validar y extraer claves',
    category: 'editor',
    featured: true,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: JsonFormatterPage,
  },
  {
    path: '/editor/markdown',
    icon: Code,
    name: 'Editor Markdown',
    labelKey: 'nav.editors.markdown',
    descKey: 'nav.editors.markdownDesc',
    homeDesc: 'Live preview, exportar a HTML',
    category: 'editor',
    featured: true,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    hover: 'hover:bg-teal-50 hover:border-teal-200',
    component: MarkdownEditorPage,
  },
  {
    path: '/editor/spreadsheet',
    icon: FileSpreadsheet,
    name: 'CSV Online',
    labelKey: 'nav.editors.spreadsheet',
    descKey: 'nav.editors.spreadsheetDesc',
    homeDesc: 'Editar hojas de cálculo directamente',
    category: 'editor',
    color: 'text-lime-600',
    bg: 'bg-lime-50',
    hover: 'hover:bg-lime-50 hover:border-lime-200',
    component: SpreadsheetEditorPage,
  },

  // ── Tools (standalone) ──
  {
    path: '/tools/unit-converter',
    icon: Ruler,
    name: 'Convertidor de Unidades',
    labelKey: 'nav.tools.units',
    descKey: 'nav.tools.unitsDesc',
    homeDesc: 'Longitud, peso, temperatura, volumen',
    category: 'tool',
    featured: true,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    hover: 'hover:bg-cyan-50 hover:border-cyan-200',
    component: UnitConverterPage,
  },
  {
    path: '/tools/ocr',
    icon: ScanText,
    name: 'OCR - Texto de Imagen',
    labelKey: 'nav.tools.ocr',
    descKey: 'nav.tools.ocrDesc',
    homeDesc: 'Extraer texto de imágenes con Tesseract.js',
    category: 'tool',
    featured: true,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    hover: 'hover:bg-violet-50 hover:border-violet-200',
    component: OcrPage,
  },
  {
    path: '/tools/image-compressor',
    icon: ImageDown,
    name: 'Compresor de Imágenes',
    labelKey: 'nav.tools.imageCompressor',
    descKey: 'nav.tools.imageCompressorDesc',
    homeDesc: 'Reduce el peso de imágenes PNG, JPG, WebP',
    category: 'tool',
    featured: true,
    color: 'text-green-600',
    bg: 'bg-green-50',
    hover: 'hover:bg-green-50 hover:border-green-200',
    component: ImageCompressorPage,
  },
  {
    path: '/tools/file-analyzer',
    icon: FileSearch2,
    name: 'Analizador de Archivos',
    labelKey: 'nav.tools.fileAnalyzer',
    descKey: 'nav.tools.fileAnalyzerDesc',
    homeDesc: 'Inspecciona metadatos, tipo MIME, firma hex',
    category: 'tool',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    hover: 'hover:bg-yellow-50 hover:border-yellow-200',
    component: FileAnalyzerPage,
  },

  // ── New tools (Fase 3-4) ──
  {
    path: '/tools/encrypt',
    icon: Lock,
    name: 'Encriptador',
    labelKey: 'nav.tools.encrypt',
    descKey: 'nav.tools.encryptDesc',
    homeDesc: 'AES-256-GCM para archivos y texto',
    category: 'tool',
    color: 'text-red-600',
    bg: 'bg-red-50',
    hover: 'hover:bg-red-50 hover:border-red-200',
    component: FileEncryptorPage,
  },
  {
    path: '/tools/calculator',
    icon: Calculator,
    name: 'Calculadora',
    labelKey: 'nav.tools.calculator',
    descKey: 'nav.tools.calculatorDesc',
    homeDesc: 'Expresiones matemáticas con funciones',
    category: 'tool',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-50 hover:border-blue-200',
    component: ExpressionCalcPage,
  },
  {
    path: '/tools/emoji',
    icon: Smile,
    name: 'Emoji Converter',
    labelKey: 'nav.tools.emoji',
    descKey: 'nav.tools.emojiDesc',
    homeDesc: 'Buscar, copiar y ver código Unicode',
    category: 'tool',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    hover: 'hover:bg-pink-50 hover:border-pink-200',
    component: EmojiConverterPage,
  },
  {
    path: '/tools/json-to-ts',
    icon: FileJson,
    name: 'JSON a TypeScript',
    labelKey: 'nav.tools.jsonToTs',
    descKey: 'nav.tools.jsonToTsDesc',
    homeDesc: 'Generar interfaces desde JSON',
    category: 'tool',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    hover: 'hover:bg-indigo-50 hover:border-indigo-200',
    component: JsonToTsPage,
  },
  {
    path: '/tools/yaml-json',
    icon: Code,
    name: 'YAML ↔ JSON',
    labelKey: 'nav.tools.yamlJson',
    descKey: 'nav.tools.yamlJsonDesc',
    homeDesc: 'Convertir entre YAML y JSON',
    category: 'tool',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    hover: 'hover:bg-cyan-50 hover:border-cyan-200',
    component: YamlJsonPage,
  },
  {
    path: '/tools/gradient',
    icon: Paintbrush,
    name: 'Gradient CSS',
    labelKey: 'nav.tools.gradient',
    descKey: 'nav.tools.gradientDesc',
    homeDesc: 'Generador visual de gradients CSS',
    category: 'tool',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-50 hover:border-purple-200',
    component: GradientPage,
  },
  {
    path: '/tools/color-palette',
    icon: Palette,
    name: 'Paleta de Colores',
    labelKey: 'nav.tools.colorPalette',
    descKey: 'nav.tools.colorPaletteDesc',
    homeDesc: 'Extraer colores y generar armonías',
    category: 'tool',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    hover: 'hover:bg-orange-50 hover:border-orange-200',
    component: ColorPalettePage,
  },
  {
    path: '/tools/md-to-pdf',
    icon: FileText,
    name: 'Markdown a PDF',
    labelKey: 'nav.tools.mdToPdf',
    descKey: 'nav.tools.mdToPdfDesc',
    homeDesc: 'Exportar Markdown a PDF profesional',
    category: 'tool',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    hover: 'hover:bg-emerald-50 hover:border-emerald-200',
    component: MdToPdfPage,
  },
  {
    path: '/tools/json-to-sql',
    icon: Database,
    name: 'JSON a SQL',
    labelKey: 'nav.tools.jsonToSql',
    descKey: 'nav.tools.jsonToSqlDesc',
    homeDesc: 'Generar INSERT statements desde JSON',
    category: 'tool',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    hover: 'hover:bg-violet-50 hover:border-violet-200',
    component: JsonToSqlPage,
  },
  {
    path: '/tools/collage',
    icon: Grid3X3,
    name: 'Collage Maker',
    labelKey: 'nav.tools.collage',
    descKey: 'nav.tools.collageDesc',
    homeDesc: 'Crear collages con múltiples imágenes',
    category: 'tool',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    hover: 'hover:bg-pink-50 hover:border-pink-200',
    component: CollageMakerPage,
  },

  // ── DevTools (individual routes) ──
  {
    path: '/devtools',
    icon: Cpu,
    name: 'DevTools',
    labelKey: 'nav.devtools',
    descKey: 'nav.devtoolsDesc',
    homeDesc: 'Base64, Hash, QR, SQL, Regex, JWT',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: DevToolsPage,
  },
  {
    path: '/devtools/base64',
    icon: Binary,
    name: 'Base64',
    labelKey: 'devtools.base64',
    descKey: 'devtools.base64Desc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: Base64Page,
  },
  {
    path: '/devtools/url',
    icon: Link,
    name: 'URL Encoder',
    labelKey: 'devtools.url',
    descKey: 'devtools.urlDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: UrlEncoderPage,
  },
  {
    path: '/devtools/hash',
    icon: Hash,
    name: 'Hash Generator',
    labelKey: 'devtools.hash',
    descKey: 'devtools.hashDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: HashGeneratorPage,
  },
  {
    path: '/devtools/qrcode',
    icon: QrCode,
    name: 'QR Generator',
    labelKey: 'devtools.qrcode',
    descKey: 'devtools.qrcodeDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: QrCodePage,
  },
  {
    path: '/devtools/qrscan',
    icon: Scan,
    name: 'QR Scanner',
    labelKey: 'devtools.qrscan',
    descKey: 'devtools.qrscanDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: QrScanPage,
  },
  {
    path: '/devtools/color',
    icon: Palette,
    name: 'Color Converter',
    labelKey: 'devtools.color',
    descKey: 'devtools.colorDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: ColorConverterPage,
  },
  {
    path: '/devtools/sql',
    icon: Database,
    name: 'SQL Formatter',
    labelKey: 'devtools.sql',
    descKey: 'devtools.sqlDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: SqlFormatterPage,
  },
  {
    path: '/devtools/diff',
    icon: FileDiff,
    name: 'Diff Checker',
    labelKey: 'devtools.diff',
    descKey: 'devtools.diffDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: DiffCheckerPage,
  },
  {
    path: '/devtools/regex',
    icon: Regex,
    name: 'Regex Tester',
    labelKey: 'devtools.regex',
    descKey: 'devtools.regexDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: RegexTesterPage,
  },
  {
    path: '/devtools/jwt',
    icon: Key,
    name: 'JWT Decoder',
    labelKey: 'devtools.jwt',
    descKey: 'devtools.jwtDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: JwtDecoderPage,
  },
  {
    path: '/devtools/jsfmt',
    icon: FileCode,
    name: 'JS Formatter',
    labelKey: 'devtools.jsfmt',
    descKey: 'devtools.jsfmtDesc',
    category: 'devtool',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    hover: 'hover:bg-slate-50 hover:border-slate-200',
    component: JsFormatterPage,
  },

  // ── Utilities (individual routes) ──
  {
    path: '/tools/utilities',
    icon: Wrench,
    name: 'Utilidades',
    labelKey: 'nav.tools.utilities',
    descKey: 'nav.tools.utilitiesDesc',
    homeDesc: 'Contraseñas, UUID, Lorem Ipsum, códigos de barras',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: UtilitiesPage,
  },
  {
    path: '/tools/utilities/password',
    icon: Key,
    name: 'Generador de Contraseñas',
    labelKey: 'utilities.password',
    descKey: 'utilities.passwordDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: PasswordGeneratorPage,
  },
  {
    path: '/tools/utilities/lorem',
    icon: Type,
    name: 'Lorem Ipsum',
    labelKey: 'utilities.lorem',
    descKey: 'utilities.loremDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: LoremIpsumPage,
  },
  {
    path: '/tools/utilities/uuid',
    icon: Hash,
    name: 'UUID Generator',
    labelKey: 'utilities.uuid',
    descKey: 'utilities.uuidDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: UuidGeneratorPage,
  },
  {
    path: '/tools/utilities/barcode',
    icon: Camera,
    name: 'Barcode Generator',
    labelKey: 'utilities.barcode',
    descKey: 'utilities.barcodeDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: BarcodeGeneratorPage,
  },
  {
    path: '/tools/utilities/case',
    icon: Type,
    name: 'Case Converter',
    labelKey: 'utilities.case',
    descKey: 'utilities.caseDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: CaseConverterPage,
  },
  {
    path: '/tools/utilities/html-entity',
    icon: FileCode,
    name: 'HTML Entities',
    labelKey: 'utilities.htmlEntity',
    descKey: 'utilities.htmlEntityDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: HtmlEntityPage,
  },
  {
    path: '/tools/utilities/cron',
    icon: Terminal,
    name: 'Cron Generator',
    labelKey: 'utilities.cron',
    descKey: 'utilities.cronDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: CronGeneratorPage,
  },
  {
    path: '/tools/utilities/css-min',
    icon: Braces,
    name: 'CSS Minifier',
    labelKey: 'utilities.cssMin',
    descKey: 'utilities.cssMinDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: CssMinifierPage,
  },
  {
    path: '/tools/utilities/base64-img',
    icon: Binary,
    name: 'Base64 Image',
    labelKey: 'utilities.base64Img',
    descKey: 'utilities.base64ImgDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: Base64ImagePage,
  },
  {
    path: '/tools/utilities/text-stats',
    icon: BarChart3,
    name: 'Text Stats',
    labelKey: 'utilities.textStats',
    descKey: 'utilities.textStatsDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: TextStatsPage,
  },
  {
    path: '/tools/utilities/number-base',
    icon: Sigma,
    name: 'Number Base',
    labelKey: 'utilities.numberBase',
    descKey: 'utilities.numberBaseDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: NumberBasePage,
  },
  {
    path: '/tools/utilities/timestamp',
    icon: Clock,
    name: 'Timestamp',
    labelKey: 'utilities.timestamp',
    descKey: 'utilities.timestampDesc',
    category: 'utility',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50 hover:border-amber-200',
    component: TimestampPage,
  },
];

// ── Helpers ──

export const getToolsByCategory = (category: ToolCategory): ToolDefinition[] =>
  toolRegistry.filter(t => t.category === category);

export const getToolByPath = (path: string): ToolDefinition | undefined =>
  toolRegistry.find(t => t.path === path);

export const getFeaturedTools = (category: ToolCategory): ToolDefinition[] =>
  toolRegistry.filter(t => t.category === category && t.featured);

export const getToolsBySubCategory = (subCategory: string): ToolDefinition[] =>
  toolRegistry.filter(t => t.subCategory === subCategory);

export const converterTools = getToolsByCategory('converter');
export const editorTools = getToolsByCategory('editor');
export const standaloneTools = getToolsByCategory('tool');
export const devtoolTools = getToolsByCategory('devtool');
export const utilityTools = getToolsByCategory('utility');

// Featured tools for homepage
export const featuredConverters = getFeaturedTools('converter');
export const featuredEditors = getFeaturedTools('editor');
export const featuredTools = getFeaturedTools('tool');

// Category groups for landing pages
export const categoryGroups = {
  converter: {
    label: 'Convertidores',
    description: 'Convierte entre múltiples formatos de archivo al instante.',
    tools: converterTools,
    subCategories: {
      image: converterTools.filter(t => t.subCategory === 'image'),
      document: converterTools.filter(t => t.subCategory === 'document'),
      audio: converterTools.filter(t => t.subCategory === 'audio'),
      video: converterTools.filter(t => t.subCategory === 'video'),
    },
  },
  editor: {
    label: 'Editores',
    description: 'Edita imágenes, texto, JSON, Markdown y hojas de cálculo.',
    tools: editorTools,
  },
  tool: {
    label: 'Herramientas',
    description: 'Utilidades standalone para tareas comunes.',
    tools: standaloneTools,
  },
  devtool: {
    label: 'DevTools',
    description: 'Herramientas para desarrolladores. Sin registro.',
    tools: devtoolTools,
  },
  utility: {
    label: 'Utilidades',
    description: 'Generadores y herramientas útiles para el día a día.',
    tools: utilityTools,
  },
};

// All tools for Home page grouping
export const homePageGroups = {
  converters: converterTools,
  editors: editorTools,
  tools: [...standaloneTools, ...devtoolTools, ...utilityTools],
};

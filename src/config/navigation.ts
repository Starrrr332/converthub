import type { LucideIcon } from 'lucide-react';
import {
  Image,
  FileText,
  Table,
  Music,
  Film,
  Edit3,
  Type,
  Braces,
  Code,
  FileSpreadsheet,
  Wrench,
  Ruler,
  Cpu,
} from 'lucide-react';

export interface NavToolItem {
  path: string;
  icon: LucideIcon;
  labelKey: string;
  descKey: string;
  color: string;
}

export const converterNav: NavToolItem[] = [
  {
    path: '/converter/image',
    icon: Image,
    labelKey: 'nav.converters.image',
    descKey: 'nav.converters.imageDesc',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    path: '/converter/pdf',
    icon: FileText,
    labelKey: 'nav.converters.pdf',
    descKey: 'nav.converters.pdfDesc',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    path: '/converter/csv',
    icon: Table,
    labelKey: 'nav.converters.csv',
    descKey: 'nav.converters.csvDesc',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    path: '/converter/audio',
    icon: Music,
    labelKey: 'nav.converters.audio',
    descKey: 'nav.converters.audioDesc',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    path: '/converter/video',
    icon: Film,
    labelKey: 'nav.converters.video',
    descKey: 'nav.converters.videoDesc',
    color: 'bg-orange-100 text-orange-600',
  },
];

export const toolsNav: NavToolItem[] = [
  {
    path: '/devtools',
    icon: Cpu,
    labelKey: 'nav.devtools',
    descKey: 'nav.devtoolsDesc',
    color: 'bg-slate-100 text-slate-600',
  },
  {
    path: '/tools/unit-converter',
    icon: Ruler,
    labelKey: 'nav.tools.units',
    descKey: 'nav.tools.unitsDesc',
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    path: '/tools/utilities',
    icon: Wrench,
    labelKey: 'nav.tools.utilities',
    descKey: 'nav.tools.utilitiesDesc',
    color: 'bg-amber-100 text-amber-600',
  },
];

export const editorNav: NavToolItem[] = [
  {
    path: '/editor/image',
    icon: Edit3,
    labelKey: 'nav.editors.image',
    descKey: 'nav.editors.imageDesc',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    path: '/editor/text',
    icon: Type,
    labelKey: 'nav.editors.text',
    descKey: 'nav.editors.textDesc',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    path: '/editor/json',
    icon: Braces,
    labelKey: 'nav.editors.json',
    descKey: 'nav.editors.jsonDesc',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    path: '/editor/markdown',
    icon: Code,
    labelKey: 'nav.editors.markdown',
    descKey: 'nav.editors.markdownDesc',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    path: '/editor/spreadsheet',
    icon: FileSpreadsheet,
    labelKey: 'nav.editors.spreadsheet',
    descKey: 'nav.editors.spreadsheetDesc',
    color: 'bg-lime-100 text-lime-600',
  },
];

export const footerNav = {
  converters: converterNav,
  editors: editorNav,
  tools: toolsNav,
};

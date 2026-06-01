import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface ToolCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  compact?: boolean;
}

export function ToolCard({ to, icon: Icon, title, description, color, compact }: ToolCardProps) {
  return (
    <Link to={to} className={`card-interactive group block h-full ${compact ? 'p-5' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`inline-flex p-3 rounded-xl ${color} group-hover:scale-105 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
      </div>
      <h3 className={`font-semibold text-slate-900 mt-4 ${compact ? 'text-base' : 'text-lg'}`}>{title}</h3>
      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{description}</p>
    </Link>
  );
}

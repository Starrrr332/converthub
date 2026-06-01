interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center mb-10' : 'mb-8'}>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className={`section-subtitle ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>
      )}
    </div>
  );
}

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE5DE]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1916]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[#786F66] font-normal">
          {subtitle}
        </p>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

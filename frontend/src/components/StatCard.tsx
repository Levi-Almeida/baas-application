import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-title">
          {title}
        </span>

        <div className="stat-card-icon">
          {icon}
        </div>
      </div>

      <strong className="stat-card-value">
        {value}
      </strong>

      {subtitle && (
        <span className="stat-card-subtitle">
          {subtitle}
        </span>
      )}
    </div>
  );
}
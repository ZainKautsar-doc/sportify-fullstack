import type { ReactNode } from 'react';
import { Card } from './Card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="py-12 text-center">
      <p className="text-xl font-bold text-slate-800">{title}</p>
      <p className="mt-2 text-slate-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  );
}

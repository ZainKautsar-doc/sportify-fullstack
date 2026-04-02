import Button from './Button';
import { Card } from './Card';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Ups, coba lagi ya', onRetry }: ErrorStateProps) {
  return (
    <Card className="py-12 text-center">
      <p className="text-xl font-bold text-slate-800">Ups, coba lagi ya</p>
      <p className="mt-2 text-slate-500">{message}</p>
      {onRetry ? (
        <div className="mt-6">
          <Button variant="secondary" onClick={onRetry}>
            Muat Ulang
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

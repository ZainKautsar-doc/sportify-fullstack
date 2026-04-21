import { Link } from 'react-router-dom';
import { MapPin, Star, Zap } from 'lucide-react';
import type { Field } from '@/src/types/domain';
import { formatCurrency, toImageByFieldType } from '@/src/lib/format';
import { Card } from '@/src/components/ui/Card';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';

interface FieldCardProps {
  field: Field;
  status: 'available' | 'full';
  bookingHref: string;
}

export default function FieldCard({ field, status, bookingHref }: FieldCardProps) {
  return (
    <Card
      hoverable
      className="group flex h-full flex-col overflow-hidden border-slate-200 p-0 transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_54px_-30px_rgba(15,23,42,0.45)]"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={toImageByFieldType(field.type)}
          alt={field.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-xl font-bold text-slate-900">{field.name}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
                <MapPin size={14} />
                Sportify Arena, Jakarta
              </p>
            </div>
            <Badge variant={status === 'available' ? 'available' : 'full'}>
              {status === 'available' ? 'Available' : 'Full'}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
              <Star size={15} fill="currentColor" />
              4.{(field.id % 5) + 4}
            </span>
            <span className="font-semibold text-slate-700">{field.type}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Mulai dari</p>
            <p className="font-display text-lg font-bold text-slate-900">
              {formatCurrency(field.price_per_hour)}/jam
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/lapangan/${field.id}`}>
              <Button size="sm" variant="secondary">
                Detail
              </Button>
            </Link>
            <Link to={bookingHref}>
              <Button size="sm">
                Booking <span className="hidden sm:inline">Kuy</span> <Zap size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

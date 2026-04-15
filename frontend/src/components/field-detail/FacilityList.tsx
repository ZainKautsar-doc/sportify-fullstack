import type { LucideIcon } from 'lucide-react';
import { CarFront, Coffee, Landmark, Shirt, ShieldCheck, ShoppingBag, Toilet, UsersRound, UtensilsCrossed } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

interface FacilityListProps {
  facilities: string[];
}

interface FacilityMeta {
  icon: LucideIcon;
  label: string;
}

const FACILITY_META: Record<string, FacilityMeta> = {
  parkir: { icon: CarFront, label: 'Parkir' },
  toilet: { icon: Toilet, label: 'Toilet' },
  musholla: { icon: Landmark, label: 'Musholla' },
  'ruang ganti': { icon: Shirt, label: 'Ruang Ganti' },
  cctv: { icon: ShieldCheck, label: 'CCTV' },
  cafe: { icon: Coffee, label: 'Cafe' },
  tribun: { icon: UsersRound, label: 'Tribun' },
  'pro shop': { icon: ShoppingBag, label: 'Pro Shop' },
};

function toFacilityMeta(name: string): FacilityMeta {
  return FACILITY_META[name.toLowerCase()] ?? { icon: UtensilsCrossed, label: name };
}

export default function FacilityList({ facilities }: FacilityListProps) {
  return (
    <Card className="space-y-4 border-slate-200/80">
      <h3 className="font-display text-xl font-bold text-slate-900">Fasilitas</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {facilities.map((facility) => {
          const { icon: Icon, label } = toFacilityMeta(facility);
          return (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
              <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <Icon size={18} />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-700">{label}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

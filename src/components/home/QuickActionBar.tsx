import Button from '@/src/components/ui/Button';

interface QuickActionBarProps {
  onExplore: () => void;
  onBooking: () => void;
}

export default function QuickActionBar({ onExplore, onBooking }: QuickActionBarProps) {
  return (
    <div className="mt-8 w-full rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row">
        <Button variant="secondary" onClick={onExplore} className="w-full rounded-xl md:w-auto">
          Eksplor Lapangan
        </Button>
        <Button variant="primary" onClick={onBooking} className="w-full rounded-xl md:w-auto">
          Booking Sekarang
        </Button>
      </div>
    </div>
  );
}

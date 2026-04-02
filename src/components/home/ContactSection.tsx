import { MessageCircleHeart } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';

export default function ContactSection() {
  return (
    <section className="space-y-4">
      <Card className="flex flex-col items-start justify-between gap-4 border-slate-200 bg-gradient-to-r from-white to-slate-50 p-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Hubungi Kami</h2>
          <p className="mt-2 text-sm text-slate-600">Butuh bantuan? Tim kami siap bantu kamu 🙌</p>
        </div>
        <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
          <Button variant="primary">
            <MessageCircleHeart size={16} />
            Chat via WhatsApp
          </Button>
        </a>
      </Card>
    </section>
  );
}

import { Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getTypographyClass } from '@/lib/typography';

interface CustomerCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  onClick?: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export function CustomerCard({ name, email, phone, onClick, onShare, onDelete }: CustomerCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={getTypographyClass('header')}>
            {name}
          </h3>
          {email && (
            <p className={getTypographyClass('body')}>
              {email}
          </p>
          )}
          {phone && (
            <p className={getTypographyClass('body')}>
              {phone}
            </p>
          )}
          </div>
        <div className="flex gap-2">
          <Button
            variant="accent"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="p-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 
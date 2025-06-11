import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getTypographyClass } from '@/lib/typography';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
}

export function EditableField({
  label,
  value,
  onSave,
  type = 'text',
  placeholder,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <label className={getTypographyClass('body')}>
        {label}
      </label>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type={type}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className={getTypographyClass('body')}>{value || placeholder}</p>
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
} 
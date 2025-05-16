import { useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface EditableFieldProps {
  name: string;
  value: string;
  isEditing: boolean;
  error?: string;
  isOwner: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  formatValue?: (value: string) => string;
  placeholder?: string;
  required?: boolean;
  setEditableFields: (fields: any) => void;
  type?: 'text' | 'date' | 'number';
}

export function EditableField({
  name,
  value,
  isEditing,
  error,
  isOwner,
  onEdit,
  onSave,
  onCancel,
  onKeyDown,
  formatValue = (v) => v,
  placeholder,
  required,
  setEditableFields,
  type = 'text'
}: EditableFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const formatDisplayValue = (val: string) => {
    if (!val) return val;
    if (type === 'date') {
      return new Date(val).toLocaleDateString();
    }
    return formatValue(val);
  };

  if (isEditing) {
    return (
      <div className="relative">
        <Input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => {
            const newValue = formatValue(e.target.value);
            setEditableFields(fields =>
              fields.map(f =>
                f.name === name
                  ? { ...f, value: newValue }
                  : f
              )
            );
          }}
          onKeyDown={onKeyDown}
          onBlur={() => onSave(value)}
          error={error}
          className={`pr-20 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:hover:opacity-80`}
          placeholder={placeholder}
          required={required}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button
            onClick={() => onSave(value)}
            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onCancel}
            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center justify-between p-2 rounded-lg ${
        isOwner ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : ''
      }`}
      onClick={isOwner ? onEdit : undefined}
      role={isOwner ? 'button' : undefined}
      tabIndex={isOwner ? 0 : undefined}
      onKeyDown={(e) => {
        if (isOwner && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onEdit();
        }
      }}
    >
      <p className="text-gray-900 dark:text-white">
        {formatDisplayValue(value) || placeholder}
      </p>
      {isOwner && (
        <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
} 
import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Check, X, Loader2, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useClickAway } from '@/hooks/useClickAway';

interface InlineEditProps {
  value: string | number;
  onSave: (value: string) => Promise<void>;
  type?: 'text' | 'number' | 'textarea' | 'date';
  label?: string;
  className?: string;
  isEditable?: boolean;
}

export default function InlineEdit({
  value,
  onSave,
  type = 'text',
  label,
  className = '',
  isEditable = true
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    return value ? new Date(value) : null;
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useClickAway(containerRef, () => {
    if (isEditing && !isSaving) {
      handleSave();
    }
  });

  useEffect(() => {
    if (isEditing && inputRef.current && type !== 'date') {
      inputRef.current.focus();
    }
  }, [isEditing, type]);

  useEffect(() => {
    if (type === 'date') {
      setSelectedDate(value ? new Date(value) : null);
    } else {
      setEditValue(value.toString());
    }
  }, [value, type]);

  const handleSave = async () => {
    if (type === 'date') {
      if (!selectedDate || selectedDate.toString() === new Date(value).toString()) {
        setIsEditing(false);
        return;
      }
    } else if (editValue === value.toString()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (type === 'date') {
        await onSave(selectedDate?.toISOString().split('T')[0] || '');
      } else {
        await onSave(editValue);
      }
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      if (type === 'date') {
        setSelectedDate(value ? new Date(value) : null);
      } else {
        setEditValue(value.toString());
      }
      setError(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isEditable) {
    return (
      <div className={`inline-block ${className}`}>
        {type === 'textarea' ? (
          <div className="whitespace-pre-wrap">{value}</div>
        ) : type === 'date' ? (
          <span>{formatDate(value.toString())}</span>
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`group relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label}
        </label>
      )}
      
      {isEditing ? (
        <div className="flex items-start gap-2">
          {type === 'textarea' ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[80px]"
              rows={3}
              disabled={isSaving}
            />
          ) : type === 'date' ? (
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                  if (date) {
                    handleSave();
                  }
                }}
                dateFormat="MMM d, yyyy"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={isSaving}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={isSaving}
            />
          )}
          
          {type !== 'date' && (
            <div className="flex flex-col gap-1">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                title="Save"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(value.toString());
                  setError(null);
                }}
                disabled={isSaving}
                className="p-1 text-gray-600 hover:text-gray-700 disabled:opacity-50"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="cursor-pointer group inline-flex items-start gap-1.5 hover:bg-gray-50 px-2 py-1 -mx-2 rounded transition-colors"
        >
          {type === 'textarea' ? (
            <div className="whitespace-pre-wrap">{value || 'Click to add text...'}</div>
          ) : type === 'date' ? (
            <span>{value ? formatDate(value.toString()) : 'Click to set date...'}</span>
          ) : (
            <span>{value || 'Click to edit...'}</span>
          )}
          {type === 'date' ? (
            <Calendar className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
          ) : (
            <Pencil className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-1 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
} 
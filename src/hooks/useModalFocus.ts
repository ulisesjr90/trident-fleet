import { useEffect, useRef } from 'react';

export function useModalFocus(isOpen: boolean) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    const previousFocus = document.activeElement as HTMLElement;

    // Focus the modal
if (modalRef.current) {
  // Ensure the element is programmatically focusable
  if (modalRef.current.tabIndex === -1 || modalRef.current.tabIndex === 0) {
    modalRef.current.focus();
  } else {
    modalRef.current.setAttribute('tabIndex', '-1');
    modalRef.current.focus();
  }
}

    // Lock focus within the modal
    const handleFocus = (e: FocusEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        e.preventDefault();
        modalRef.current.focus();
      }
    };

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        previousFocus?.focus();
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('keydown', handleEscape);

    // Cleanup
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('keydown', handleEscape);
      previousFocus?.focus();
    };
  }, [isOpen]);

  return modalRef;
} 
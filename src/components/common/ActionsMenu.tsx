import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export interface Action {
  label: string;
  onClick: () => void;
  className?: string;
}

interface ActionsMenuProps {
  actions: Action[];
}

interface Position {
  top: number;
  left: number;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({ actions }) => {
  const [menuPosition, setMenuPosition] = useState<Position | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!buttonRef.current || !menuRef.current) return;

    requestAnimationFrame(() => {
      if (!buttonRef.current || !menuRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      
      // Calculate position
      let top = buttonRect.bottom + window.scrollY;
      let left = buttonRect.right - menuRect.width + window.scrollX;

      // Adjust if menu would go off screen
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left + menuRect.width > viewportWidth) {
        left = buttonRect.left - menuRect.width + window.scrollX;
      }

      if (top + menuRect.height > viewportHeight) {
        top = buttonRect.top - menuRect.height + window.scrollY;
      }

      setMenuPosition({ top, left });
    });
  };

  // Handle scroll and resize events
  useEffect(() => {
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  return (
    <Menu>
      {({ open }) => {
        // Calculate position when menu opens
        useLayoutEffect(() => {
          if (open) {
            updatePosition();
          } else {
            setMenuPosition(null);
          }
        }, [open]);

        return (
          <>
            <Menu.Button ref={buttonRef} className="p-2 rounded-lg hover:bg-gray-100">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
            </Menu.Button>

            {open && createPortal(
              <div 
                ref={menuRef}
                className="fixed z-50"
                style={menuPosition ? {
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  opacity: 1,
                } : {
                  opacity: 0,
                  pointerEvents: 'none'
                }}
              >
                <Menu.Items
                  static
                  className="w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    {actions.map((action, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick();
                            }}
                            className={`
                              ${active ? 'bg-gray-100' : ''}
                              ${action.className || 'text-gray-700'}
                              block w-full text-left px-4 py-2 text-sm
                            `}
                          >
                            {action.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </div>,
              document.body
            )}
          </>
        );
      }}
    </Menu>
  );
}; 
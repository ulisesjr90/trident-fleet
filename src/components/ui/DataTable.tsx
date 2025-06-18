import { ReactNode } from 'react';
import { getTypographyClass } from '@/lib/typography';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DataTable({ className, children, ...props }: DataTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const checkScroll = () => {
    if (tableRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      checkScroll();
      table.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        table.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  return (
    <div className="relative">
      {showLeftScroll && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent flex items-center justify-center pointer-events-none">
          <ChevronLeft className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <div
        ref={tableRef}
        className={cn(
          "relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent",
          className
        )}
        {...props}
      >
        <table className="min-w-full">
          {children}
        </table>
      </div>
      {showRightScroll && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent flex items-center justify-center pointer-events-none">
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
}

interface DataTableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function DataTableHeader({ className, ...props }: DataTableHeaderProps) {
  return (
    <thead className={cn("bg-transparent", className)} {...props} />
  );
}

interface DataTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function DataTableBody({ className, ...props }: DataTableBodyProps) {
  return (
    <tbody className={cn("divide-y divide-gray-200 dark:divide-gray-700", className)} {...props} />
  );
}

interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export function DataTableRow({ className, ...props }: DataTableRowProps) {
  return (
    <tr className={cn("hover:bg-gray-50/50 dark:hover:bg-gray-800/50", className)} {...props} />
  );
}

interface DataTableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sticky?: boolean;
}

export function DataTableHeaderCell({ className, sticky, ...props }: DataTableHeaderCellProps) {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider whitespace-nowrap bg-transparent",
        sticky && "sticky right-0 bg-white dark:bg-gray-800 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.3)] z-[1]",
        className
      )}
      {...props}
    />
  );
}

interface DataTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  sticky?: boolean;
}

export function DataTableCell({ className, sticky, ...props }: DataTableCellProps) {
  return (
    <td
      className={cn(
        "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 bg-transparent",
        sticky && "sticky right-0 bg-white dark:bg-gray-800 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.3)] z-[1]",
        className
      )}
      {...props}
    />
  );
} 
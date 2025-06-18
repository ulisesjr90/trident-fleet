import { Clock } from 'lucide-react';
import { Customer } from '@/types/customer';
import { useCustomerHistory } from '@/hooks/useCustomerHistory';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getTypographyClass } from '@/lib/typography';

interface CustomerHistoryProps {
  customer: Customer;
}

export function CustomerHistory({ customer }: CustomerHistoryProps) {
  const { history, loading, error } = useCustomerHistory(customer.id);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 dark:bg-red-900/10 rounded-lg">
        <p className={getTypographyClass('body')}>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className={getTypographyClass('header')}>History</h3>
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className={getTypographyClass('body')}>
            Created on {customer.createdAt.toLocaleDateString()}
          </p>
          {customer.updatedAt && (
            <p className={getTypographyClass('body')}>
              Last updated on {customer.updatedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-gray-500" />
        <h3 className={getTypographyClass('header')}>Activity History</h3>
      </div>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <p className={getTypographyClass('body')}>
                  {item.description}
                </p>
                <p className={getTypographyClass('body')}>
                  By {item.user.name} • {item.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className={getTypographyClass('body')}>
            No activity history available.
          </p>
        </div>
      )}
    </div>
  );
} 
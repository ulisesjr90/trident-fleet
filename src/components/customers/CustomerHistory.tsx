import { Clock } from 'lucide-react';
import { Customer } from '@/types/customer';
import { useCustomerHistory } from '@/hooks/useCustomerHistory';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Activity History
        </h3>
      </div>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  {item.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  By {item.user.name} • {item.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No activity history available.
          </p>
        </div>
      )}
    </div>
  );
} 
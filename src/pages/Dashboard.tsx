import { Car, Users, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: typeof Car;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <div className="flex items-center">
      <div className="flex-1">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-semibold mt-1 text-gray-900">{value}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Vehicles"
          value="0"
          icon={Car}
        />
        <StatCard
          title="Active Customers"
          value="0"
          icon={Users}
        />
        <StatCard
          title="Revenue (MTD)"
          value="$0"
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-4">
            {/* Activity list will be implemented later */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Vehicle Status</h2>
          <div className="space-y-4 mt-4">
            {/* Vehicle status chart will be implemented later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
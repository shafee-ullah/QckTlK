import React from 'react';
import { BarChart3, Users, MessageSquare, ThumbsUp } from 'lucide-react';

export const StatsTab = () => {
  // These would typically come from an API
  const stats = [
    { name: 'Total Posts', value: '24', icon: BarChart3, change: '+12%', changeType: 'positive' },
    { name: 'Total Comments', value: '156', icon: MessageSquare, change: '+8%', changeType: 'positive' },
    { name: 'Total Upvotes', value: '1,234', icon: ThumbsUp, change: '+24%', changeType: 'positive' },
    { name: 'Followers', value: '89', icon: Users, change: '+3', changeType: 'positive' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Stats</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>{' '}
                <span className="text-gray-500 dark:text-gray-400">
                  {stat.changeType === 'increase' ? 'Increase' : 'Decrease'} from last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Overview</h3>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-300">
            Your activity statistics will be displayed here. This could include charts or graphs showing your posting 
            frequency, engagement rates, and other relevant metrics over time.
          </p>
          <div className="mt-6 h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <BarChart3 className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-400">Activity chart will appear here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;

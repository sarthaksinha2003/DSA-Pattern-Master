import React from 'react';
import { Check, Target, Award, TrendingUp } from 'lucide-react';

const Dashboard = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Completed</span>
          <Check className="w-6 h-6" />
        </div>
        <div className="text-4xl font-bold">{stats.completed}</div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Total Questions</span>
          <Target className="w-6 h-6" />
        </div>
        <div className="text-4xl font-bold">{stats.total}</div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Progress</span>
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="text-4xl font-bold">{stats.percentage}%</div>
      </div>
    </div>
  );
};

export default Dashboard;

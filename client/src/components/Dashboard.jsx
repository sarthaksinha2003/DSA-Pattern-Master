import React from 'react';
import { Check, Target, TrendingUp, Star } from 'lucide-react';

const Dashboard = ({ stats, part3Count, part4Count, part3Completed, part4Completed }) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="text-xs text-gray-400 mt-1">PART 1 & PART 2 only</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Progress</span>
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-4xl font-bold">{stats.percentage}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {part3Count !== undefined && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-yellow-300 font-semibold text-lg">PART 3 Recommended</div>
                  <div className="text-gray-300 text-sm">Microsoft SDE-1 / Internship / Amazon</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end space-x-2">
                  <div className="text-4xl font-bold text-yellow-300">{part3Completed !== undefined ? part3Completed : 0}</div>
                  <div className="text-xl text-yellow-200/60">/</div>
                  <div className="text-2xl font-semibold text-yellow-200/80">{part3Count}</div>
                </div>
                <div className="text-xs text-yellow-200/50 mt-1">completed</div>
              </div>
            </div>
          </div>
        )}

        {part4Count !== undefined && (
          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="text-purple-300 font-semibold text-lg">PART 4 Recommended</div>
                  <div className="text-gray-300 text-sm">Amazon-level interviews</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end space-x-2">
                  <div className="text-4xl font-bold text-purple-300">{part4Completed !== undefined ? part4Completed : 0}</div>
                  <div className="text-xl text-purple-200/60">/</div>
                  <div className="text-2xl font-semibold text-purple-200/80">{part4Count}</div>
                </div>
                <div className="text-xs text-purple-200/50 mt-1">completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

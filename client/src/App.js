import React, { useState, useEffect } from 'react';
import { LogOut, User, Target } from 'lucide-react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import QuestionList from './components/QuestionList';
import { QUESTION_DATA } from './data/questions';
import { register, login, getProgress, toggleQuestion as apiToggleQuestion } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await getProgress();
      setCompletedQuestions(data.completedQuestions || {});
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData, isLogin) => {
    try {
      let response;
      if (isLogin) {
        response = await login(formData.email, formData.password);
      } else {
        response = await register(formData.name, formData.email, formData.password);
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      await fetchProgress();
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCompletedQuestions({});
  };

  const handleToggleQuestion = async (question) => {
    try {
      const response = await apiToggleQuestion(question);
      setCompletedQuestions(response.completedQuestions);
    } catch (error) {
      console.error('Error toggling question:', error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateStats = () => {
    const total = Object.values(QUESTION_DATA).reduce((acc, part) => {
      if (typeof part === 'object' && !Array.isArray(part)) {
        return acc + Object.values(part).reduce((subAcc, category) => {
          if (Array.isArray(category)) {
            return subAcc + category.length;
          } else if (typeof category === 'object') {
            return subAcc + Object.values(category).reduce((subSubAcc, subCategory) => {
              return subSubAcc + (Array.isArray(subCategory) ? subCategory.length : 0);
            }, 0);
          }
          return subAcc;
        }, 0);
      } else if (Array.isArray(part)) {
        return acc + part.length;
      }
      return acc;
    }, 0);

    const completed = Object.values(completedQuestions).filter(Boolean).length;
    return { total, completed, percentage: total > 0 ? ((completed / total) * 100).toFixed(1) : 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-100">DSA Pattern Master</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-300" />
              <span className="text-gray-200 font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard stats={stats} />

    {/* Search */}
    <div className="mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search questions..."
        className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400"
      />
    </div>

    {/* Questions */}
    <QuestionList
      questionData={QUESTION_DATA}
      expandedSections={expandedSections}
      toggleSection={toggleSection}
      completedQuestions={completedQuestions}
      toggleQuestion={handleToggleQuestion}
      searchTerm={searchTerm}
    />
      </div>

      {/* Note at the bottom */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-8 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-300 text-sm text-center">
            <span className="font-semibold text-gray-200">Note:</span> If a question is not on LeetCode, it means that question is only for theory purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

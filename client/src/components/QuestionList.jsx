import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';

const QuestionList = ({ 
  questionData, 
  expandedSections, 
  toggleSection, 
  completedQuestions, 
  toggleQuestion,
  searchTerm 
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSub, setExpandedSub] = useState({});

  const getLeetCodeLink = (question) => {
    const slug = question
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return `https://leetcode.com/problems/${slug}/`;
  };

  const filterQuestions = (questions) => {
    if (!searchTerm) return questions;
    return questions.filter(q => q.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const toggleCategory = (key) => {
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubCategory = (key) => {
    setExpandedSub(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      {Object.entries(questionData).map(([partName, partContent]) => (
        <div key={partName} className="bg-gray-900 rounded-xl shadow-sm border border-gray-800">
          <button
            onClick={() => toggleSection(partName)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800 transition"
          >
            <h2 className="text-xl font-bold text-gray-100">{partName}</h2>
            {expandedSections[partName] ? (
              <ChevronDown className="w-6 h-6 text-gray-300" />
            ) : (
              <ChevronRight className="w-6 h-6 text-gray-300" />
            )}
          </button>

          {expandedSections[partName] && (
            <div className="px-6 pb-4 space-y-4">
              {Object.entries(partContent).map(([categoryName, categoryContent]) => (
                <div key={categoryName} className="border-l-4 border-indigo-500 pl-4">
                  <button
                    onClick={() => toggleCategory(`${partName}:${categoryName}`)}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <h3 className="font-semibold text-lg text-gray-200">{categoryName}</h3>
                    {expandedCategories[`${partName}:${categoryName}`] ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedCategories[`${partName}:${categoryName}`] && (
                    Array.isArray(categoryContent) ? (
                      <div className="space-y-2 pl-2">
                        {filterQuestions(categoryContent).map((question, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg transition group">
                            <button
                              onClick={() => toggleQuestion(question)}
                              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                                completedQuestions[question]
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-600 group-hover:border-indigo-400'
                              }`}
                            >
                              {completedQuestions[question] && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </button>
                            <a
                              href={getLeetCodeLink(question)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-gray-200 hover:text-indigo-400 transition"
                            >
                              {question}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(categoryContent).map(([subCategoryName, questions]) => {
                          const subKey = `${partName}:${categoryName}:${subCategoryName}`;
                          const isOpen = !!expandedSub[subKey];
                          return (
                            <div key={subCategoryName} className="rounded-lg pl-6 ml-2 border-l border-gray-700">
                              <button
                                onClick={() => toggleSubCategory(subKey)}
                                className="w-full flex items-center justify-between py-2"
                              >
                                <span className="font-medium text-sm text-gray-300">{subCategoryName}</span>
                                {isOpen ? (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="space-y-2 pl-2">
                                  {filterQuestions(questions).map((question, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg transition group">
                                      <button
                                        onClick={() => toggleQuestion(question)}
                                        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                                          completedQuestions[question]
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-600 group-hover:border-indigo-400'
                                        }`}
                                      >
                                        {completedQuestions[question] && (
                                          <Check className="w-4 h-4 text-white" />
                                        )}
                                      </button>
                                      <a
                                        href={getLeetCodeLink(question)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-gray-200 hover:text-indigo-400 transition"
                                      >
                                        {question}
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;

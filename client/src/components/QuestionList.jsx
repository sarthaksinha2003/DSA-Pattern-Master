import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Star } from 'lucide-react';
import { isRecommendedByPart3, isRecommendedByPart4 } from '../utils/questionUtils';

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
    if (!Array.isArray(questions)) return [];
    if (!searchTerm) return questions;
    const term = searchTerm.toLowerCase().trim();
    return questions.filter(q => q && typeof q === 'string' && q.toLowerCase().includes(term));
  };

  const hasMatchingQuestions = (questions) => {
    if (!searchTerm) return true;
    if (!Array.isArray(questions)) return false;
    return questions.some(q => q.toLowerCase().includes(searchTerm.toLowerCase().trim()));
  };

  const hasMatchingSubCategories = (categoryContent) => {
    if (!searchTerm) return true;
    if (Array.isArray(categoryContent)) {
      return hasMatchingQuestions(categoryContent);
    }
    // Check if any subcategory or its questions match
    return Object.entries(categoryContent).some(([subCategoryName, questions]) => {
      const term = searchTerm.toLowerCase().trim();
      return (
        subCategoryName.toLowerCase().includes(term) ||
        (Array.isArray(questions) && questions.some(q => q.toLowerCase().includes(term)))
      );
    });
  };

  const toggleCategory = (key) => {
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubCategory = (key) => {
    setExpandedSub(prev => ({ ...prev, [key]: !prev[key] }));
  };


  return (
    <div className="space-y-4">
      {Object.entries(questionData).map(([partName, partContent]) => {
        // Check if part has any matches when searching
        const partHasMatches = !searchTerm || Object.values(partContent).some(categoryContent => 
          hasMatchingSubCategories(categoryContent)
        );

        if (!partHasMatches) return null;

        return (
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
                {Object.entries(partContent).map(([categoryName, categoryContent]) => {
                  // Check if category has matches when searching
                  const categoryHasMatches = !searchTerm || hasMatchingSubCategories(categoryContent);
                  
                  if (!categoryHasMatches) return null;

                  return (
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
                          const isPart3Recommended = partName === "PART 1: SOLO PATTERNS" && isRecommendedByPart3(categoryName, subCategoryName);
                          const isPart4Recommended = partName === "PART 2: HYBRID PATTERNS" && isRecommendedByPart4(categoryName, subCategoryName);
                          const isRecommended = isPart3Recommended || isPart4Recommended;
                          
                          // Check if subcategory has matches when searching
                          const term = searchTerm ? searchTerm.toLowerCase().trim() : '';
                          const subCategoryHasMatches = !searchTerm || 
                            subCategoryName.toLowerCase().includes(term) ||
                            (Array.isArray(questions) && hasMatchingQuestions(questions));
                          
                          if (!subCategoryHasMatches) return null;
                          
                          // Determine styling based on which part recommends it
                          const borderColor = isPart3Recommended ? 'border-yellow-500' : isPart4Recommended ? 'border-purple-500' : 'border-gray-700';
                          const bgColor = isPart3Recommended ? 'bg-yellow-500/5' : isPart4Recommended ? 'bg-purple-500/5' : '';
                          const textColor = isPart3Recommended ? 'text-yellow-300' : isPart4Recommended ? 'text-purple-300' : 'text-gray-300';
                          const badgeBg = isPart3Recommended ? 'bg-yellow-500/20' : 'bg-purple-500/20';
                          const badgeText = isPart3Recommended ? 'text-yellow-300' : 'text-purple-300';
                          const badgeBorder = isPart3Recommended ? 'border-yellow-500/30' : 'border-purple-500/30';
                          const partLabel = isPart3Recommended ? 'PART 3' : 'PART 4';
                          
                          return (
                            <div key={subCategoryName} className={`rounded-lg pl-6 ml-2 border-l ${borderColor} ${bgColor}`}>
                              <button
                                onClick={() => toggleSubCategory(subKey)}
                                className="w-full flex items-center justify-between py-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className={`font-medium text-sm ${textColor}`}>
                                    {subCategoryName}
                                  </span>
                                  {isRecommended && (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${badgeBg} ${badgeText} border ${badgeBorder}`}>
                                      <Star className="w-3 h-3 mr-1" />
                                      {partLabel}
                                    </span>
                                  )}
                                </div>
                                {isOpen ? (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="space-y-2 pl-2">
                                  {Array.isArray(questions) && filterQuestions(questions).map((question, idx) => (
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
              );
                })}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
};

export default QuestionList;

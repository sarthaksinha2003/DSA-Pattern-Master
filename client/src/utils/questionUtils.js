import { QUESTION_DATA } from "../data/questions";

export function isRecommendedByPart3(sectionName, subCategoryName) {
  const part3 = QUESTION_DATA["PART 3: SOLO INTERVIEW FILTER"];
  if (!part3 || !sectionName || !subCategoryName) {
    return false;
  }

  // Check if section exists in PART 3
  const part3Section = part3[sectionName];
  if (!part3Section) return false;

  const normalizedSubCategory = subCategoryName.toLowerCase().trim();

  // Get all DO topics for this section
  const doTopics =
    part3Section["DO"] ||
    part3Section["DO (IMPORTANT)"] ||
    part3Section["DO (VERY IMPORTANT)"] ||
    part3Section["DO (HIGH PRIORITY)"] ||
    part3Section["DO (MUST DO ALL)"] ||
    part3Section["DO (EXTREMELY IMPORTANT)"];

  if (!Array.isArray(doTopics)) return false;

  // Check if subcategory matches any DO topic
  for (const topic of doTopics) {
    const normalizedTopic = topic.toLowerCase().trim();
    
    // Direct match
    if (normalizedSubCategory === normalizedTopic) {
      return true;
    }
    
    // Check if subcategory contains topic or vice versa
    if (normalizedSubCategory.includes(normalizedTopic) || normalizedTopic.includes(normalizedSubCategory)) {
      return true;
    }
    
    // Handle combined topics like "Two Pointers (Opposite, Same, Partitioning)"
    // matching "Two Pointers - Opposite Ends", "Two Pointers - Same Direction", etc.
    const topicBase = normalizedTopic.split(/[(),]/)[0].trim();
    if (topicBase && normalizedSubCategory.includes(topicBase)) {
      // Extract keywords from combined topic
      const topicKeywords = normalizedTopic.match(/\b(opposite|same|partitioning|fixed|variable|max|min|count|frequency|counting|lookup|prefix|grouping|bucketing|classic|lower|upper|rotated|peak|valley|matching|monotonic|increasing|decreasing|index|top|kth|streaming|online|scheduling|interval|operations|overlap|greedy)\b/gi);
      if (topicKeywords) {
        const subCategoryLower = normalizedSubCategory.toLowerCase();
        for (const keyword of topicKeywords) {
          if (subCategoryLower.includes(keyword.toLowerCase())) {
            return true;
          }
        }
      }
    }
    
    // Handle cases where PART 1 has "-" separator and PART 3 has combined names
    // e.g., "Two Pointers - Opposite Ends" should match "Two Pointers (Opposite, Same, Partitioning)"
    const subCategoryBase = normalizedSubCategory.split(/[-–—]/)[0].trim();
    if (subCategoryBase && normalizedTopic.includes(subCategoryBase)) {
      return true;
    }
  }

  return false;
}

export function countPart3Questions() {
  const part1 = QUESTION_DATA["PART 1: SOLO PATTERNS"];
  const part3 = QUESTION_DATA["PART 3: SOLO INTERVIEW FILTER"];

  if (!part1 || !part3) {
    return 0;
  }

  let total = 0;

  for (const sectionKey in part3) {
    const section = part3[sectionKey];

    const doTopics =
      section["DO"] ||
      section["DO (IMPORTANT)"] ||
      section["DO (VERY IMPORTANT)"] ||
      section["DO (HIGH PRIORITY)"] ||
      section["DO (MUST DO ALL)"] ||
      section["DO (EXTREMELY IMPORTANT)"];

    if (!Array.isArray(doTopics)) continue;

    const part1Section = part1[sectionKey];
    if (!part1Section) continue;

    for (const topic of doTopics) {
      for (const subTopic in part1Section) {
        if (subTopic.includes(topic)) {
          const questions = part1Section[subTopic];
          if (Array.isArray(questions)) {
            total += questions.length;
          }
        }
      }
    }
  }

  return total;
}

export function countPart4Questions() {
  const part2 = QUESTION_DATA["PART 2: HYBRID PATTERNS"];
  const part4 = QUESTION_DATA["PART 4: HYBRID INTERVIEW FILTER"];

  if (!part2 || !part4) {
    return 0;
  }

  let total = 0;

  for (const part4SectionKey in part4) {
    const part4Section = part4[part4SectionKey];
    if (!part4Section || typeof part4Section !== "object") continue;

    // Normalize PART 4 section name for matching
    const normalizedPart4Section = part4SectionKey.toLowerCase().trim();

    // Find matching section in PART 2
    let part2Section = null;
    for (const part2SectionKey in part2) {
      const normalizedPart2Section = part2SectionKey.toLowerCase().trim();
      
      // Match section names (handle case differences)
      // e.g., "A. ARRAY / WINDOW / SUM HYBRIDS" should match "A. Array / Window / Sum Hybrids"
      if (
        normalizedPart2Section === normalizedPart4Section ||
        normalizedPart2Section.replace(/^[a-z]\.\s*/i, "").trim() === normalizedPart4Section.replace(/^[a-z]\.\s*/i, "").trim() ||
        normalizedPart2Section.includes(normalizedPart4Section.replace(/^[a-z]\.\s*/i, "")) ||
        normalizedPart4Section.includes(normalizedPart2Section.replace(/^[a-z]\.\s*/i, ""))
      ) {
        part2Section = part2[part2SectionKey];
        break;
      }
    }

    if (!part2Section) continue;

    const doTopics =
      part4Section["DO"] ||
      part4Section["DO (IMPORTANT)"] ||
      part4Section["DO (VERY IMPORTANT)"] ||
      part4Section["DO (HIGH PRIORITY)"] ||
      part4Section["DO (MUST DO ALL)"] ||
      part4Section["DO (EXTREMELY IMPORTANT)"] ||
      part4Section["DO (LIMITED)"];

    if (!Array.isArray(doTopics)) continue;

    for (const topic of doTopics) {
      const normalizedTopic = topic.toLowerCase().trim();
      
      for (const subTopic in part2Section) {
        const normalizedSubTopic = subTopic.toLowerCase().trim();
        
        // Check if subTopic matches the topic
        // Handle cases like "Sliding Window + Prefix Sum" matching "Sliding Window + Prefix Sum"
        if (
          normalizedSubTopic === normalizedTopic ||
          normalizedSubTopic.includes(normalizedTopic) ||
          normalizedTopic.includes(normalizedSubTopic) ||
          // Handle partial matches for hybrid patterns with "+"
          (normalizedTopic.includes("+") && normalizedTopic.split("+").every(part => normalizedSubTopic.includes(part.trim()))) ||
          (normalizedSubTopic.includes("+") && normalizedSubTopic.split("+").every(part => normalizedTopic.includes(part.trim())))
        ) {
          const questions = part2Section[subTopic];
          if (Array.isArray(questions)) {
            total += questions.length;
          }
        }
      }
    }
  }

  return total;
}

export function countCompletedPart3Questions(completedQuestions) {
  const part1 = QUESTION_DATA["PART 1: SOLO PATTERNS"];
  const part3 = QUESTION_DATA["PART 3: SOLO INTERVIEW FILTER"];

  if (!part1 || !part3 || !completedQuestions) {
    return 0;
  }

  let completed = 0;

  for (const sectionKey in part3) {
    const section = part3[sectionKey];

    const doTopics =
      section["DO"] ||
      section["DO (IMPORTANT)"] ||
      section["DO (VERY IMPORTANT)"] ||
      section["DO (HIGH PRIORITY)"] ||
      section["DO (MUST DO ALL)"] ||
      section["DO (EXTREMELY IMPORTANT)"];

    if (!Array.isArray(doTopics)) continue;

    const part1Section = part1[sectionKey];
    if (!part1Section) continue;

    for (const topic of doTopics) {
      for (const subTopic in part1Section) {
        if (subTopic.includes(topic)) {
          const questions = part1Section[subTopic];
          if (Array.isArray(questions)) {
            for (let i = 0; i < questions.length; i++) {
              if (completedQuestions[questions[i]]) {
                completed++;
              }
            }
          }
        }
      }
    }
  }

  return completed;
}

export function countCompletedPart4Questions(completedQuestions) {
  const part2 = QUESTION_DATA["PART 2: HYBRID PATTERNS"];
  const part4 = QUESTION_DATA["PART 4: HYBRID INTERVIEW FILTER"];

  if (!part2 || !part4 || !completedQuestions) {
    return 0;
  }

  let completed = 0;

  for (const part4SectionKey in part4) {
    const part4Section = part4[part4SectionKey];
    if (!part4Section || typeof part4Section !== "object") continue;

    // Normalize PART 4 section name for matching
    const normalizedPart4Section = part4SectionKey.toLowerCase().trim();

    // Find matching section in PART 2
    let part2Section = null;
    for (const part2SectionKey in part2) {
      const normalizedPart2Section = part2SectionKey.toLowerCase().trim();
      
      // Match section names (handle case differences)
      if (
        normalizedPart2Section === normalizedPart4Section ||
        normalizedPart2Section.replace(/^[a-z]\.\s*/i, "").trim() === normalizedPart4Section.replace(/^[a-z]\.\s*/i, "").trim() ||
        normalizedPart2Section.includes(normalizedPart4Section.replace(/^[a-z]\.\s*/i, "")) ||
        normalizedPart4Section.includes(normalizedPart2Section.replace(/^[a-z]\.\s*/i, ""))
      ) {
        part2Section = part2[part2SectionKey];
        break;
      }
    }

    if (!part2Section) continue;

    const doTopics =
      part4Section["DO"] ||
      part4Section["DO (IMPORTANT)"] ||
      part4Section["DO (VERY IMPORTANT)"] ||
      part4Section["DO (HIGH PRIORITY)"] ||
      part4Section["DO (MUST DO ALL)"] ||
      part4Section["DO (EXTREMELY IMPORTANT)"] ||
      part4Section["DO (LIMITED)"];

    if (!Array.isArray(doTopics)) continue;

    for (const topic of doTopics) {
      const normalizedTopic = topic.toLowerCase().trim();
      
      for (const subTopic in part2Section) {
        const normalizedSubTopic = subTopic.toLowerCase().trim();
        
        // Check if subTopic matches the topic
        if (
          normalizedSubTopic === normalizedTopic ||
          normalizedSubTopic.includes(normalizedTopic) ||
          normalizedTopic.includes(normalizedSubTopic) ||
          // Handle partial matches for hybrid patterns with "+"
          (normalizedTopic.includes("+") && normalizedTopic.split("+").every(part => normalizedSubTopic.includes(part.trim()))) ||
          (normalizedSubTopic.includes("+") && normalizedSubTopic.split("+").every(part => normalizedTopic.includes(part.trim())))
        ) {
          const questions = part2Section[subTopic];
          if (Array.isArray(questions)) {
            for (let i = 0; i < questions.length; i++) {
              if (completedQuestions[questions[i]]) {
                completed++;
              }
            }
          }
        }
      }
    }
  }

  return completed;
}

export function isRecommendedByPart4(sectionName, subCategoryName) {
  const part2 = QUESTION_DATA["PART 2: HYBRID PATTERNS"];
  const part4 = QUESTION_DATA["PART 4: HYBRID INTERVIEW FILTER"];

  if (!part2 || !part4 || !sectionName || !subCategoryName) {
    return false;
  }

  // Normalize section names for matching (PART 4 uses uppercase, PART 2 uses title case)
  const normalizedSectionName = sectionName.toLowerCase().trim();
  const normalizedSubCategory = subCategoryName.toLowerCase().trim();

  // Check each PART 4 section to see if it matches this PART 2 section
  for (const part4SectionKey in part4) {
    const part4Section = part4[part4SectionKey];
    if (!part4Section || typeof part4Section !== "object") continue;

    // Normalize PART 4 section name for comparison
    const normalizedPart4Section = part4SectionKey.toLowerCase().trim();

    // Check if PART 2 section matches PART 4 section
    // e.g., "A. Array / Window / Sum Hybrids" should match "A. ARRAY / WINDOW / SUM HYBRIDS"
    const sectionMatch = 
      normalizedSectionName === normalizedPart4Section ||
      normalizedSectionName.includes(normalizedPart4Section.replace(/^[a-z]\.\s*/i, "")) ||
      normalizedPart4Section.includes(normalizedSectionName.replace(/^[a-z]\.\s*/i, "")) ||
      // Handle case differences: "array / window / sum hybrids" should match
      normalizedSectionName.replace(/^[a-z]\.\s*/i, "").trim() === normalizedPart4Section.replace(/^[a-z]\.\s*/i, "").trim();

    if (!sectionMatch) continue;

    // Get all DO topics for this section
    const doTopics =
      part4Section["DO"] ||
      part4Section["DO (IMPORTANT)"] ||
      part4Section["DO (VERY IMPORTANT)"] ||
      part4Section["DO (HIGH PRIORITY)"] ||
      part4Section["DO (MUST DO ALL)"] ||
      part4Section["DO (EXTREMELY IMPORTANT)"] ||
      part4Section["DO (LIMITED)"];

    if (!Array.isArray(doTopics)) continue;

    // Check if subcategory matches any DO topic
    for (const topic of doTopics) {
      const normalizedTopic = topic.toLowerCase().trim();

      // Direct match
      if (normalizedSubCategory === normalizedTopic) {
        return true;
      }

      // Check if subcategory contains topic or vice versa
      if (normalizedSubCategory.includes(normalizedTopic) || normalizedTopic.includes(normalizedSubCategory)) {
        return true;
      }

      // Handle hybrid patterns with "+" separator
      // e.g., "Sliding Window + Prefix Sum" matching "Sliding Window + Prefix Sum"
      if (normalizedTopic.includes("+")) {
        const topicParts = normalizedTopic.split("+").map(p => p.trim());
        if (topicParts.every(part => normalizedSubCategory.includes(part))) {
          return true;
        }
      }

      if (normalizedSubCategory.includes("+")) {
        const subCategoryParts = normalizedSubCategory.split("+").map(p => p.trim());
        if (subCategoryParts.every(part => normalizedTopic.includes(part))) {
          return true;
        }
      }
    }
  }

  return false;
}


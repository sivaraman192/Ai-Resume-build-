import { calculateAtsScore } from './atsScoring.js';

export const calculateResumeScore = (resume) => {
  const result = calculateAtsScore(resume);
  return {
    score: result.overallScore,
    tips: result.suggestions,
    subScores: result.subScores,
    missingKeywords: result.missingKeywords
  };
};

export default calculateResumeScore;

import type {
  Question,
  QuestionCategory,
  CreateQuestionData,
  UpdateQuestionData,
} from '@/types/interview';
import dataStructuresData from '../../data/data-structures.json';
import lowLevelDesignData from '../../data/low-level-design.json';
import highLevelDesignData from '../../data/high-level-design.json';

// Load questions from JSON files
const loadQuestionsFromJSON = (): Question[] => {
  const allQuestions = [
    ...(dataStructuresData as { questions: Question[] }).questions,
    ...(lowLevelDesignData as { questions: Question[] }).questions,
    ...(highLevelDesignData as { questions: Question[] }).questions,
  ];

  return allQuestions.map(q => ({
    ...q,
    // Ensure dates are strings
    createdAt: q.createdAt ?? new Date().toISOString(),
    updatedAt: q.updatedAt ?? new Date().toISOString(),
  }));
};

const getQuestions = (): Question[] => {
  return loadQuestionsFromJSON();
};

const getQuestionsByCategory = (category: QuestionCategory): Question[] => {
  const questions = getQuestions();
  return questions.filter(q => q.category === category);
};

const getQuestionById = (id: string): Question | null => {
  const questions = getQuestions();
  return questions.find(q => q.id === id) ?? null;
};

const createQuestion = async (
  _questionData: CreateQuestionData,
): Promise<Question> => {
  // Persistence is not available without storage
  throw new Error('Question creation is not supported. Questions are read-only from JSON files');
};

const updateQuestion = async (
  _id: string,
  _questionData: UpdateQuestionData,
): Promise<Question> => {
  // Persistence is not available without storage
  throw new Error('Question updates are not supported. Questions are read-only from JSON files');
};

const deleteQuestion = async (_id: string): Promise<void> => {
  // Persistence is not available without storage
  throw new Error('Question deletion is not supported. Questions are read-only from JSON files');
};

export const questionService = {
  getQuestions,
  getQuestionsByCategory,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};


import type {
  Question,
  QuestionCategory,
  CreateQuestionData,
  UpdateQuestionData,
} from '@/types/interview';
import questionsData from '../../data/data.json';

// Load questions from JSON file
const loadQuestionsFromJSON = (): Question[] => {
  return (questionsData as { questions: Question[] }).questions.map(q => ({
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
  throw new Error('Question creation is not supported. Questions are read-only from data.json');
};

const updateQuestion = async (
  _id: string,
  _questionData: UpdateQuestionData,
): Promise<Question> => {
  // Persistence is not available without storage
  throw new Error('Question updates are not supported. Questions are read-only from data.json');
};

const deleteQuestion = async (_id: string): Promise<void> => {
  // Persistence is not available without storage
  throw new Error('Question deletion is not supported. Questions are read-only from data.json');
};

export const questionService = {
  getQuestions,
  getQuestionsByCategory,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};


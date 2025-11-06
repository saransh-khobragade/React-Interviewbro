import type {
  Question,
  QuestionCategory,
  CreateQuestionData,
  UpdateQuestionData,
} from '@/types/interview';
import questionsData from '../../data/data.json';

const QUESTIONS_STORAGE_KEY = 'interview-questions';

// Load questions from JSON file
const loadQuestionsFromJSON = (): Question[] => {
  return (questionsData as { questions: Question[] }).questions.map(q => ({
    ...q,
    // Ensure dates are strings
    createdAt: q.createdAt ?? new Date().toISOString(),
    updatedAt: q.updatedAt ?? new Date().toISOString(),
  }));
};

// Initialize questions - prioritize JSON file, fallback to localStorage
const initializeQuestions = (): Question[] => {
  // Always try to load from JSON file first (so updates to JSON are reflected)
  const jsonQuestions = loadQuestionsFromJSON();
  if (jsonQuestions.length > 0) {
    // Store in localStorage for caching
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(jsonQuestions));
    return jsonQuestions;
  }

  // Fallback to localStorage if JSON is empty or fails
  const existingQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
  if (existingQuestions !== null) {
    try {
      const parsed = JSON.parse(existingQuestions) as Question[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      localStorage.removeItem(QUESTIONS_STORAGE_KEY);
    }
  }

  // Fallback to empty array
  return [];
};

const getQuestions = (): Question[] => {
  return initializeQuestions();
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
  questionData: CreateQuestionData,
): Promise<Question> => {
  const questions = getQuestions();
  const newQuestion: Question = {
    id: Date.now().toString(),
    ...questionData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  questions.push(newQuestion);
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return newQuestion;
};

const updateQuestion = async (
  id: string,
  questionData: UpdateQuestionData,
): Promise<Question> => {
  const questions = getQuestions();
  const questionIndex = questions.findIndex(q => q.id === id);

  if (questionIndex === -1) {
    throw new Error('Question not found');
  }

  const existingQuestion = questions[questionIndex];
  if (!existingQuestion) {
    throw new Error('Question not found');
  }

  const updatedQuestion: Question = {
    ...existingQuestion,
    ...questionData,
    updatedAt: new Date().toISOString(),
  };

  questions[questionIndex] = updatedQuestion;
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return updatedQuestion;
};

const deleteQuestion = async (id: string): Promise<void> => {
  const questions = getQuestions();
  const filteredQuestions = questions.filter(q => q.id !== id);

  if (filteredQuestions.length === questions.length) {
    throw new Error('Question not found');
  }

  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(filteredQuestions));

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const questionService = {
  getQuestions,
  getQuestionsByCategory,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};


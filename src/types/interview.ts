export type QuestionCategory = 'data-structures' | 'low-level-design' | 'high-level-design';

export interface Question {
  id: string;
  title: string;
  description: string;
  category: QuestionCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  solution?: string;
  examples?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionData {
  title: string;
  description: string;
  category: QuestionCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  solution?: string;
  examples?: string[];
}

export interface UpdateQuestionData {
  title?: string;
  description?: string;
  category?: QuestionCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  solution?: string;
  examples?: string[];
}


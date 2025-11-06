import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Question } from '@/types/interview';
import { Badge } from '@/components/ui/badge';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const getDifficultyColor = (
    difficulty: 'easy' | 'medium' | 'hard',
  ): string => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return '';
    }
  };

  const getSolutionBullets = (solution: string): string[] => {
    // Split by periods, semicolons, or newlines, then filter and trim
    return solution
      .split(/[.;]\s+|\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-base sm:text-lg mb-2'>{question.title}</CardTitle>
            <CardDescription className='text-xs sm:text-sm leading-relaxed'>
              {question.description}
            </CardDescription>
          </div>
        </div>
        <div className='flex flex-wrap gap-2 mt-4'>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty.toUpperCase()}
          </Badge>
          {question.tags.map(tag => (
            <Badge key={tag} variant='secondary' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {question.examples && question.examples.length > 0 && (
          <div className='mb-4'>
            <h4 className='text-sm font-semibold mb-2'>Examples:</h4>
            <div className='bg-muted p-3 rounded-sm'>
              <pre className='text-xs whitespace-pre-wrap font-mono'>
                {question.examples.join('\n\n')}
              </pre>
            </div>
          </div>
        )}

        {question.solution !== undefined && question.solution !== '' && (
          <div className='mb-4'>
            <h4 className='text-sm font-semibold mb-2'>Solution:</h4>
            <div className='bg-muted p-3 rounded-sm'>
              <ul className='list-disc list-inside space-y-1'>
                {getSolutionBullets(question.solution).map((bullet, index) => (
                  <li key={index} className='text-sm leading-relaxed'>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


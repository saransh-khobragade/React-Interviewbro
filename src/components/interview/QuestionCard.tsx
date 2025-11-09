import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Question } from '@/types/interview';

interface QuestionCardProps {
  question: Question;
  isHighlighted?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isHighlighted = false,
}) => {
  const [copied, setCopied] = useState(false);

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
      // eslint-disable-next-line require-unicode-regexp
      .split(/[.;]\s+|\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  const handleShare = (e: React.MouseEvent): void => {
    e.stopPropagation(); // Prevent accordion toggle
    const url = new URL(window.location.href);
    url.searchParams.set('q', question.id);
    const shareUrl = url.toString();

    // Copy to clipboard
    void navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });

    // Update URL without reload
    window.history.pushState({}, '', url.toString());
  };

  return (
    <AccordionItem
      value={question.id}
      id={`question-${question.id}`}
      className={`border rounded-md mb-2 sm:mb-3 ${
        isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <AccordionTrigger className='px-3 sm:px-6 py-3 sm:py-4 hover:no-underline'>
        <div className='flex-1 text-left'>
          <div className='flex items-start justify-between gap-2 mb-1 sm:mb-2'>
            <h3 className='text-sm sm:text-lg font-semibold pr-2'>{question.title}</h3>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleShare}
              className='shrink-0 h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs'
              title={copied ? 'Copied!' : 'Share link'}
            >
              {copied ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <polyline points='20 6 9 17 4 12' />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
                  <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
                </svg>
              )}
            </Button>
          </div>
          <p className='text-[10px] sm:text-sm text-muted-foreground leading-relaxed mb-2'>
            {question.description}
          </p>
          <div className='flex flex-wrap gap-1.5 sm:gap-2'>
            <Badge className={`${getDifficultyColor(question.difficulty)} text-[10px] sm:text-xs`}>
              {question.difficulty.toUpperCase()}
            </Badge>
            {question.tags.map(tag => (
              <Badge key={tag} variant='secondary' className='text-[10px] sm:text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className='px-3 sm:px-6 pb-3 sm:pb-6'>
        {question.examples && question.examples.length > 0 && (
          <div className='mb-2 sm:mb-4'>
            <h4 className='text-xs sm:text-sm font-semibold mb-1 sm:mb-2'>Examples:</h4>
            <div className='bg-muted p-2 sm:p-3 rounded-sm'>
              <pre className='text-[10px] sm:text-xs whitespace-pre-wrap font-mono'>
                {question.examples.join('\n\n')}
              </pre>
            </div>
          </div>
        )}

        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        question.codeSnippet && (
          <div className='mb-2 sm:mb-4'>
            <h4 className='text-xs sm:text-sm font-semibold mb-1 sm:mb-2'>Code:</h4>
            <div className='rounded-sm overflow-hidden code-snippet-wrapper'>
              <SyntaxHighlighter
                language='typescript'
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                  lineHeight: '1.5',
                  padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                  borderRadius: '0.125rem',
                }}
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
              >
                {question.codeSnippet}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {question.solution !== undefined && question.solution !== '' && (
          <div className='mb-2 sm:mb-4'>
            <h4 className='text-xs sm:text-sm font-semibold mb-1 sm:mb-2'>Solution:</h4>
            <ul className='list-disc list-inside space-y-0.5 sm:space-y-1'>
              {getSolutionBullets(question.solution).map((bullet, index) => (
                <li key={index} className='text-xs sm:text-sm leading-relaxed'>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        )}

        {question.video && (
          <div className='mb-2 sm:mb-4'>
            <h4 className='text-xs sm:text-sm font-semibold mb-1 sm:mb-2'>Video Explanation:</h4>
            <div className='rounded-sm overflow-hidden bg-muted'>
              <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className='absolute top-0 left-0 w-full h-full'
                  src={(() => {
                    // Convert youtu.be URL to embed URL
                    const url = question.video || '';
                    if (url.includes('youtu.be/')) {
                      const videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
                      return `https://www.youtube.com/embed/${videoId}`;
                    }
                    if (url.includes('youtube.com/watch?v=')) {
                      const videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
                      return `https://www.youtube.com/embed/${videoId}`;
                    }
                    return url;
                  })()}
                  title='Video explanation'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              </div>
            </div>
            <a
              href={question.video}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs sm:text-sm text-primary hover:underline mt-1 inline-block'
            >
              Watch on YouTube →
            </a>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};


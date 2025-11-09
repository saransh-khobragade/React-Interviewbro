import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion } from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { questionService } from '@/services/questionService';
import type { Question, QuestionCategory } from '@/types/interview';
import { QuestionCard } from './QuestionCard';

export const InterviewMaterial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QuestionCategory>('data-structures');
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

  // Read URL parameters on mount and when URL changes
  useEffect(() => {
    const handleUrlChange = (): void => {
      const params = new URLSearchParams(window.location.search);
      const questionId = params.get('q');
      
      if (questionId) {
        const question = questionService.getQuestionById(questionId);
        if (question) {
          setActiveTab(question.category);
          setHighlightedQuestionId(questionId);
          setOpenAccordion(questionId); // Open the accordion for this question
          
          // Scroll to question after a short delay to ensure DOM is ready
          setTimeout(() => {
            const element = document.getElementById(`question-${questionId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // Highlight the question briefly
              element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
              setTimeout(() => {
                element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
              }, 2000);
            }
          }, 100);
        }
      } else {
        setHighlightedQuestionId(null);
        setOpenAccordion(undefined);
      }
    };

    // Handle initial load
    handleUrlChange();

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Update URL when tab changes (remove question param if switching tabs manually)
  const handleTabChange = (value: QuestionCategory): void => {
    setActiveTab(value);
    // Remove question param when manually switching tabs
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
    setHighlightedQuestionId(null);
    setOpenAccordion(undefined);
  };

  const getQuestionsForCategory = (category: QuestionCategory): Question[] => {
    return questionService.getQuestionsByCategory(category);
  };

  const getCategoryTitle = (category: QuestionCategory): string => {
    switch (category) {
      case 'data-structures':
        return 'Data Structures';
      case 'low-level-design':
        return 'Low Level Design';
      case 'high-level-design':
        return 'High Level Design';
      default:
        return '';
    }
  };

  const getCategoryDescription = (category: QuestionCategory): string => {
    switch (category) {
      case 'data-structures':
        return 'Practice fundamental data structures and algorithms problems';
      case 'low-level-design':
        return 'Design object-oriented systems and solve design problems';
      case 'high-level-design':
        return 'Design scalable distributed systems and architectures';
      default:
        return '';
    }
  };

  const renderQuestionsTab = (category: QuestionCategory): React.ReactNode => {
    const questions = getQuestionsForCategory(category);
    return (
      <div className='space-y-3 sm:space-y-4'>
        {questions.length === 0 ? (
          <div className='text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm'>
            No questions available in this category.
          </div>
        ) : (
          <Accordion 
            type='single' 
            collapsible 
            className='w-full'
            value={openAccordion ?? ''}
            onValueChange={(value) => setOpenAccordion(value || undefined)}
          >
            {questions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                isHighlighted={highlightedQuestionId === question.id}
              />
            ))}
          </Accordion>
        )}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50'>
        <div className='container mx-auto px-3 sm:px-4 py-2 sm:py-4'>
          <div className='flex items-center justify-center'>
            <h1 className='text-base sm:text-xl font-bold'>InterviewBro</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-3 sm:px-4 py-4 sm:py-8'>
        <div className='space-y-4 sm:space-y-6'>
          {/* Questions Tabs */}
          <Card>
            <CardHeader className='p-3 sm:p-6'>
              <CardTitle className='text-base sm:text-xl'>{getCategoryTitle(activeTab)}</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                {getCategoryDescription(activeTab)}
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3 sm:p-6 pt-0'>
              <Tabs
                value={activeTab}
                onValueChange={value => {
                  handleTabChange(value as QuestionCategory);
                }}
              >
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='data-structures' className='text-xs sm:text-sm'>
                    <span className='hidden sm:inline'>Data Structures</span>
                    <span className='sm:hidden'>DS</span>
                  </TabsTrigger>
                  <TabsTrigger value='low-level-design' className='text-xs sm:text-sm'>
                    <span className='hidden sm:inline'>Low Level Design</span>
                    <span className='sm:hidden'>LLD</span>
                  </TabsTrigger>
                  <TabsTrigger value='high-level-design' className='text-xs sm:text-sm'>
                    <span className='hidden sm:inline'>High Level Design</span>
                    <span className='sm:hidden'>HLD</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='data-structures' className='mt-1'>
                  {renderQuestionsTab('data-structures')}
                </TabsContent>

                <TabsContent value='low-level-design' className='mt-1'>
                  {renderQuestionsTab('low-level-design')}
                </TabsContent>

                <TabsContent value='high-level-design' className='mt-1'>
                  {renderQuestionsTab('high-level-design')}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};


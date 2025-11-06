import type { ReactElement } from 'react';
import { InterviewMaterial } from '@/components/interview/InterviewMaterial';
import { Toaster } from '@/components/ui/sonner';

function App(): ReactElement {
  return (
    <div className='min-h-screen bg-background'>
      <InterviewMaterial />
      <Toaster />
    </div>
  );
}

export default App;

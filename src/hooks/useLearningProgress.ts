import { useLocalStorage } from './useLocalStorage';
import { LearningPath, Video, Document, Quiz } from '../types';

export function useLearningProgress() {
  const [completedVideos, setCompletedVideos] = useLocalStorage<string[]>('completed-videos', []);
  const [completedDocuments, setCompletedDocuments] = useLocalStorage<string[]>('completed-documents', []);
  const [completedQuizzes, setCompletedQuizzes] = useLocalStorage<string[]>('completed-quizzes', []);
  const [quizScores, setQuizScores] = useLocalStorage<Record<string, number>>('quiz-scores', {});

  const markVideoComplete = (videoId: string) => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos([...completedVideos, videoId]);
    }
  };

  const markDocumentComplete = (documentId: string) => {
    if (!completedDocuments.includes(documentId)) {
      setCompletedDocuments([...completedDocuments, documentId]);
    }
  };

  const markQuizComplete = (quizId: string, score: number) => {
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes([...completedQuizzes, quizId]);
    }
    setQuizScores({ ...quizScores, [quizId]: score });
  };

  const calculatePathProgress = (path: LearningPath) => {
    const completedSteps = path.steps.filter(step => {
      switch (step.type) {
        case 'watch':
          return completedVideos.includes(step.resourceId);
        case 'read':
          return completedDocuments.includes(step.resourceId);
        case 'test':
          return completedQuizzes.includes(step.resourceId);
        default:
          return false;
      }
    });
    return Math.round((completedSteps.length / path.steps.length) * 100);
  };

  return {
    completedVideos,
    completedDocuments,
    completedQuizzes,
    quizScores,
    markVideoComplete,
    markDocumentComplete,
    markQuizComplete,
    calculatePathProgress,
  };
}
export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  thumbnailUrl: string;
  keyTimestamps: Timestamp[];
  completed: boolean;
}

export interface Timestamp {
  time: string;
  description: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'article';
  url: string;
  summary: string;
  keyTakeaways: string[];
  definitions: Definition[];
  completed: boolean;
}

export interface Definition {
  term: string;
  definition: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  completed: boolean;
  score?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: LearningStep[];
  progress: number;
}

export interface LearningStep {
  id: string;
  type: 'watch' | 'read' | 'test';
  title: string;
  resourceId: string;
  completed: boolean;
}

export interface Summary {
  id: string;
  title: string;
  type: 'notes' | 'mindmap' | 'flashcards';
  content: any;
  sourceId: string;
}

export interface Bookmark {
  id: string;
  resourceId: string;
  resourceType: 'video' | 'document' | 'quiz';
  title: string;
  createdAt: string;
}

export interface SearchResult {
  id: string;
  query: string;
  timestamp: string;
  videos: YouTubeVideo[];
  articles: Article[];
  papers: ResearchPaper[];
  quiz: Quiz;
  flashcards: Flashcard[];
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  thumbnailUrl: string;
  url: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  source: string;
  author: string;
  publishedAt: string;
  url: string;
  summary: string;
  readTime: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publishedAt: string;
  doi: string;
  url: string;
  abstract: string;
  keyFindings: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudyNote {
  id: string;
  title: string;
  sourceType: 'video' | 'article' | 'document';
  sourceId: string;
  sourceUrl?: string;
  content: NoteContent;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface NoteContent {
  summary: string;
  keyPoints: KeyPoint[];
  definitions: Definition[];
  timestamps?: Timestamp[];
  quotes?: Quote[];
  sections: NoteSection[];
}

export interface KeyPoint {
  id: string;
  text: string;
  importance: 'high' | 'medium' | 'low';
  timestamp?: string;
  pageReference?: string;
}

export interface Quote {
  id: string;
  text: string;
  source: string;
  timestamp?: string;
  pageReference?: string;
}

export interface NoteSection {
  id: string;
  title: string;
  content: string;
  subsections?: NoteSection[];
  timestamp?: string;
}
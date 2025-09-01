import { Video, Document, Quiz, LearningPath } from '../types';

export const mockVideos: Video[] = [
  {
    id: 'video-1',
    title: 'Introduction to Machine Learning',
    youtubeId: 'aircAruvnKk',
    duration: '19:13',
    thumbnailUrl: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg',
    keyTimestamps: [
      { time: '2:15', description: 'What is Machine Learning?' },
      { time: '5:30', description: 'Types of ML Algorithms' },
      { time: '12:45', description: 'Neural Networks Basics' },
    ],
    completed: false,
  },
  {
    id: 'video-2',
    title: 'Linear Algebra Fundamentals',
    youtubeId: 'fNk_zzaMoSs',
    duration: '14:52',
    thumbnailUrl: 'https://img.youtube.com/vi/fNk_zzaMoSs/maxresdefault.jpg',
    keyTimestamps: [
      { time: '1:20', description: 'Vector Operations' },
      { time: '6:10', description: 'Matrix Multiplication' },
      { time: '11:30', description: 'Eigenvalues and Eigenvectors' },
    ],
    completed: false,
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Deep Learning Research Paper - Attention Is All You Need',
    type: 'pdf',
    url: 'https://arxiv.org/pdf/1706.03762.pdf',
    summary: 'This groundbreaking paper introduces the Transformer architecture, which relies entirely on attention mechanisms without recurrence or convolutions. The model achieves superior results in machine translation tasks while being more parallelizable and requiring significantly less time to train.',
    keyTakeaways: [
      'Attention mechanisms can replace recurrence and convolutions entirely',
      'Multi-head attention allows the model to attend to different representation subspaces',
      'Positional encoding is crucial for sequence understanding without recurrence',
      'The Transformer achieves state-of-the-art results on translation benchmarks',
    ],
    definitions: [
      {
        term: 'Attention Mechanism',
        definition: 'A technique that allows models to focus on relevant parts of input sequences when making predictions.',
      },
      {
        term: 'Multi-Head Attention',
        definition: 'A method that runs multiple attention functions in parallel to capture different types of relationships.',
      },
    ],
    completed: false,
  },
  {
    id: 'doc-2',
    title: 'Calculus Fundamentals',
    type: 'article',
    url: '#',
    summary: 'A comprehensive introduction to differential and integral calculus, covering limits, derivatives, and integrals with practical applications in physics and engineering.',
    keyTakeaways: [
      'Limits form the foundation of calculus',
      'Derivatives measure rates of change',
      'Integrals calculate areas under curves',
      'The Fundamental Theorem connects derivatives and integrals',
    ],
    definitions: [
      {
        term: 'Derivative',
        definition: 'The rate of change of a function with respect to its variable.',
      },
      {
        term: 'Integral',
        definition: 'The accumulation of quantities, often representing area under a curve.',
      },
    ],
    completed: false,
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Machine Learning Basics Quiz',
    questions: [
      {
        id: 'q1',
        question: 'Which type of machine learning uses labeled training data?',
        options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Deep Learning'],
        correctAnswer: 0,
        explanation: 'Supervised learning uses labeled training data to learn patterns and make predictions on new, unseen data.',
      },
      {
        id: 'q2',
        question: 'What is the main goal of a neural network?',
        options: ['Store data', 'Approximate complex functions', 'Sort information', 'Display results'],
        correctAnswer: 1,
        explanation: 'Neural networks are designed to approximate complex functions by learning patterns from data through interconnected nodes.',
      },
      {
        id: 'q3',
        question: 'Which activation function is commonly used in hidden layers?',
        options: ['Linear', 'Sigmoid', 'ReLU', 'Step Function'],
        correctAnswer: 2,
        explanation: 'ReLU (Rectified Linear Unit) is widely used in hidden layers because it helps with the vanishing gradient problem and is computationally efficient.',
      },
    ],
    completed: false,
  },
];

export const mockLearningPaths: LearningPath[] = [
  {
    id: 'path-1',
    title: 'Machine Learning Fundamentals',
    description: 'Master the basics of machine learning through structured learning',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        type: 'watch',
        title: 'Watch: Introduction to ML',
        resourceId: 'video-1',
        completed: false,
      },
      {
        id: 'step-2',
        type: 'read',
        title: 'Read: Attention Mechanisms',
        resourceId: 'doc-1',
        completed: false,
      },
      {
        id: 'step-3',
        type: 'test',
        title: 'Test: ML Basics Quiz',
        resourceId: 'quiz-1',
        completed: false,
      },
    ],
  },
  {
    id: 'path-2',
    title: 'Mathematical Foundations',
    description: 'Build strong mathematical foundations for advanced topics',
    progress: 0,
    steps: [
      {
        id: 'step-4',
        type: 'watch',
        title: 'Watch: Linear Algebra',
        resourceId: 'video-2',
        completed: false,
      },
      {
        id: 'step-5',
        type: 'read',
        title: 'Read: Calculus Fundamentals',
        resourceId: 'doc-2',
        completed: false,
      },
    ],
  },
];
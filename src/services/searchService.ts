import { GoogleGenerativeAI } from '@google/generative-ai';

// This service will handle API calls to various educational content sources
// Add your API keys and implement actual API calls here

export class SearchService {
  private static instance: SearchService;
  
  // API Configuration - Add your API keys here
  private readonly YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  private readonly GOOGLE_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY || '';
  private readonly GOOGLE_SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID || '';
  private readonly GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
  private readonly PUBMED_API_KEY = import.meta.env.VITE_PUBMED_API_KEY || '';
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
  
  private genAI: GoogleGenerativeAI | null = null;
  
  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  constructor() {
    console.log('SearchService constructor - Gemini API Key:', this.GEMINI_API_KEY ? `Present (${this.GEMINI_API_KEY.substring(0, 10)}...)` : 'Missing');
    if (this.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
      console.log('Gemini AI initialized successfully');
    } else {
      console.warn('Gemini API key not found, will use mock data');
    }
  }

  // YouTube API Integration
  async searchYouTubeVideos(query: string, maxResults: number = 5) {
    try {
      if (!this.YOUTUBE_API_KEY) {
        console.warn('YouTube API key not found, using mock data');
        return this.getMockYouTubeVideos(query);
      }

      console.log('YouTube API Key present:', !!this.YOUTUBE_API_KEY);
      console.log('Making YouTube API request for query:', query);

      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.YOUTUBE_API_KEY}`
      );

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        console.error('YouTube API Error Details:', {
          status: searchResponse.status,
          statusText: searchResponse.statusText,
          response: errorText,
          apiKey: this.YOUTUBE_API_KEY ? `${this.YOUTUBE_API_KEY.substring(0, 10)}...` : 'Not found'
        });
        console.warn('YouTube API failed, falling back to mock data');
        return this.getMockYouTubeVideos(query);
      }

      const searchData = await searchResponse.json();
      
      // Get video details for duration and view count
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${this.YOUTUBE_API_KEY}`
      );

      const detailsData = await detailsResponse.json();
      
      return searchData.items.map((item: any, index: number) => {
        const details = detailsData.items[index];
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          channelName: item.snippet.channelTitle,
          duration: this.formatDuration(details?.contentDetails?.duration || 'PT0M0S'),
          viewCount: this.formatViewCount(details?.statistics?.viewCount || '0'),
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          description: item.snippet.description
        };
      });
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getMockYouTubeVideos(query);
    }
  }

  // Google Custom Search for Articles
  async searchArticles(query: string, maxResults: number = 5) {
    try {
      // TODO: Implement actual Google Custom Search API call
      // const response = await fetch(
      //   `https://www.googleapis.com/customsearch/v1?key=${this.GOOGLE_SEARCH_API_KEY}&cx=${this.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query + ' blog article')}&num=${maxResults}`
      // );
      
      // Mock data for demonstration
      return this.getMockArticles(query);
    } catch (error) {
      console.error('Google Search API error:', error);
      return this.getMockArticles(query);
    }
  }

  // Academic Paper Search (PubMed, arXiv, etc.)
  async searchResearchPapers(query: string, maxResults: number = 5) {
    try {
      // TODO: Implement actual academic database API calls
      // Example for PubMed:
      // const response = await fetch(
      //   `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`
      // );
      
      // Mock data for demonstration
      return this.getMockResearchPapers(query);
    } catch (error) {
      console.error('Research paper API error:', error);
      return this.getMockResearchPapers(query);
    }
  }

  // AI-powered Quiz Generation
  async generateQuiz(topic: string, difficulty: string = 'intermediate') {
    try {
      if (!this.genAI) {
        console.warn('Gemini API key not found, using mock data');
        return this.getMockQuiz(topic);
      }
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are an expert educational content creator. Create a comprehensive ${difficulty} level quiz about "${topic}" with exactly 8 multiple choice questions.

CRITICAL: Return ONLY a valid JSON object with this exact structure:
{
  "title": "${topic} Knowledge Quiz",
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}

Requirements for each question:
1. Test different cognitive levels: recall, comprehension, application, analysis
2. Cover diverse aspects of ${topic}: fundamentals, applications, best practices, troubleshooting, advanced concepts, real-world scenarios
3. Make all 4 options plausible but only one correct
4. Provide educational explanations that teach concepts
5. Use specific, practical examples related to ${topic}
6. Vary difficulty across questions (2 easy, 4 medium, 2 hard)
7. Focus on practical knowledge and real-world applications
8. Avoid generic or superficial questions`;

      const result = await this.retryWithBackoff(() => model.generateContent(prompt));
      const response = await result.response;
      const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
      
      const quizData = JSON.parse(jsonText);
      
      // Validate the quiz data structure
      if (!quizData.title || !quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error('Invalid quiz data structure from Gemini');
      }
      
      if (quizData.questions.length !== 8) {
        throw new Error('Quiz must have exactly 8 questions');
      }
      
      return {
        id: `quiz-${Date.now()}`,
        title: quizData.title,
        questions: quizData.questions.map((q: any, index: number) => ({
          id: `q${index + 1}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        })),
        completed: false
      };
    } catch (error) {
      console.error('Gemini quiz generation error:', error);
      return Promise.resolve(this.getMockQuiz(topic));
    }
  }

  // AI-powered Flashcard Generation
  async generateFlashcards(topic: string) {
    console.log('=== FLASHCARD GENERATION START ===');
    console.log('Topic:', topic);
    console.log('Gemini API available:', !!this.genAI);
    console.log('API Key present:', !!this.GEMINI_API_KEY);
    
    try {
      if (!this.genAI) {
        console.warn('Gemini API key not found, using mock data');
        return this.getMockFlashcards(topic);
      }

      console.log('Attempting to call Gemini API...');
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are an expert educational content creator specializing in comprehensive study materials. Create exactly 8 high-quality flashcards about "${topic}".

CRITICAL: Return ONLY a valid JSON array with this exact structure:
[
  {
    "front": "Clear, specific question or concept prompt",
    "back": "Comprehensive answer with explanations, examples, and context",
    "difficulty": "easy|medium|hard"
  }
]

Requirements for each flashcard:
1. **Front side**: Clear, specific questions that test understanding (not just memorization)
2. **Back side**: Comprehensive answers (100-200 words) with:
   - Detailed explanations
   - Practical examples
   - Real-world applications
   - Connections to related concepts
3. **Difficulty distribution**: 2 easy, 4 medium, 2 hard
4. **Content areas**: Cover diverse aspects of ${topic}:
   - Fundamental concepts and definitions
   - Practical applications and use cases
   - Best practices and methodologies
   - Problem-solving scenarios
   - Advanced concepts and optimization
   - Real-world implementations
   - Troubleshooting and debugging
   - Future trends and developments

Focus on creating flashcards that promote deep learning and critical thinking about ${topic}.`;

      console.log('Sending request to Gemini...');
      const result = await this.retryWithBackoff(() => model.generateContent(prompt));
      const response = await result.response;
      console.log('Gemini API response received for flashcards');
      const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
      
      console.log('Raw Gemini response:', jsonText.substring(0, 200) + '...');
      const flashcards = JSON.parse(jsonText);
      console.log('Parsed flashcards:', flashcards.length);
      
      return flashcards.map((card: any, index: number) => ({
        id: `fc-${index + 1}`,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty || 'medium'
      }));
    } catch (error) {
      console.error('Gemini flashcard generation error:', error);
      console.log('Falling back to mock flashcard data');
      return Promise.resolve(this.getMockFlashcards(topic));
    }
  }

  // Retry mechanism with exponential backoff for rate limiting
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        const isRateLimit = error.message?.includes('429');
        const isLastAttempt = attempt === maxRetries;
        
        if (!isRateLimit || isLastAttempt) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Rate limited, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  // Test Gemini connection
  async testGeminiConnection() {
    if (!this.genAI) {
      throw new Error('Gemini API not initialized');
    }
    
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello in one word");
    const response = await result.response;
    return response.text();
  }

  // Helper methods for YouTube API
  private formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private formatViewCount(viewCount: string): string {
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  }

  // Mock data methods (replace with actual API responses)
  private getMockYouTubeVideos(query: string) {
    return [
      {
        id: 'yt-1',
        title: `Complete Guide to ${query} - Beginner to Advanced`,
        channelName: 'EduTech Academy',
        duration: '24:15',
        viewCount: '1.2M views',
        publishedAt: '2024-01-15',
        thumbnailUrl: 'https://img.youtube.com/vi/ukzFI9rgwfU/maxresdefault.jpg',
        url: 'https://youtube.com/watch?v=ukzFI9rgwfU',
        description: `Comprehensive tutorial covering all aspects of ${query}...`
      },
      {
        id: 'yt-2',
        title: `${query} Explained in 10 Minutes`,
        channelName: 'Quick Learning',
        duration: '10:32',
        viewCount: '850K views',
        publishedAt: '2024-01-10',
        thumbnailUrl: 'https://img.youtube.com/vi/LlKAna21fLE/maxresdefault.jpg',
        url: 'https://youtube.com/watch?v=LlKAna21fLE',
        description: `Quick overview of ${query} fundamentals...`
      }
    ];
  }

  private getMockArticles(query: string) {
    return [
      {
        id: 'art-1',
        title: `Understanding ${query}: A Comprehensive Analysis`,
        source: 'TechCrunch',
        author: 'Dr. Sarah Johnson',
        publishedAt: '2024-01-20',
        url: 'https://techcrunch.com/example-article',
        summary: `This article provides an in-depth analysis of ${query} and its implications for modern technology.`,
        readTime: '8 min read'
      },
      {
        id: 'art-2',
        title: `The Future of ${query}: Trends and Predictions`,
        source: 'MIT Technology Review',
        author: 'Prof. Michael Chen',
        publishedAt: '2024-01-18',
        url: 'https://technologyreview.com/example-article',
        summary: `Exploring emerging trends and future developments in ${query} technology.`,
        readTime: '12 min read'
      }
    ];
  }

  private getMockResearchPapers(query: string) {
    return [
      {
        id: 'paper-1',
        title: `Advanced Techniques in ${query}: A Systematic Review`,
        authors: ['Dr. Alice Smith', 'Prof. Bob Wilson', 'Dr. Carol Davis'],
        journal: 'Nature Technology',
        publishedAt: '2024-01-25',
        doi: '10.1038/example.2024.001',
        url: 'https://nature.com/articles/example',
        abstract: `This systematic review examines recent advances in ${query} methodologies...`,
        keyFindings: [
          `New ${query} techniques show 40% improvement in efficiency`,
          'Cross-domain applications demonstrate significant potential',
          'Future research directions identified in three key areas'
        ]
      }
    ];
  }

  private getMockQuiz(topic: string) {
    return {
      id: `quiz-${Date.now()}`,
      title: `${topic} Knowledge Quiz`,
      questions: [
        {
          id: 'q1',
          question: `What is a fundamental concept in ${topic}?`,
          options: [
            'Basic understanding of core principles',
            'Advanced implementation techniques',
            'Historical background only',
            'All of the above'
          ],
          correctAnswer: 0,
          explanation: `Understanding core principles is fundamental when learning ${topic}.`
        },
        {
          id: 'q2',
          question: `What makes ${topic} important in modern development?`,
          options: [
            'It solves real-world problems',
            'It has a large community',
            'It offers good performance',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: `${topic} is valuable because it combines problem-solving capabilities, community support, and performance benefits.`
        },
        {
          id: 'q3',
          question: `When working with ${topic}, what should you prioritize?`,
          options: [
            'Speed of development only',
            'Code quality and maintainability',
            'Using the latest features',
            'Following trends blindly'
          ],
          correctAnswer: 1,
          explanation: `Code quality and maintainability are crucial for long-term success with ${topic}.`
        },
        {
          id: 'q4',
          question: `What is a common best practice when learning ${topic}?`,
          options: [
            'Memorizing syntax only',
            'Understanding concepts and practicing',
            'Copying code without understanding',
            'Avoiding documentation'
          ],
          correctAnswer: 1,
          explanation: `Understanding concepts and regular practice leads to mastery of ${topic}.`
        },
        {
          id: 'q5',
          question: `How does ${topic} fit into the broader technology landscape?`,
          options: [
            'It works in isolation',
            'It integrates with other technologies',
            'It replaces all other tools',
            'It has limited applications'
          ],
          correctAnswer: 1,
          explanation: `${topic} is most powerful when integrated with other technologies in the ecosystem.`
        },
        {
          id: 'q6',
          question: `What should beginners focus on when starting with ${topic}?`,
          options: [
            'Advanced features immediately',
            'Fundamentals and basic concepts',
            'Complex projects right away',
            'Memorizing all documentation'
          ],
          correctAnswer: 1,
          explanation: `Building a strong foundation with fundamentals is essential for success with ${topic}.`
        },
        {
          id: 'q7',
          question: `What makes someone proficient in ${topic}?`,
          options: [
            'Years of experience only',
            'Understanding principles and continuous learning',
            'Knowing every feature by heart',
            'Working on one project type'
          ],
          correctAnswer: 1,
          explanation: `Proficiency comes from understanding core principles and staying updated with ${topic} developments.`
        },
        {
          id: 'q8',
          question: `What is the most effective way to improve ${topic} skills?`,
          options: [
            'Reading documentation only',
            'Watching tutorials passively',
            'Hands-on practice and building projects',
            'Attending conferences only'
          ],
          correctAnswer: 2,
          explanation: `Active practice and building real projects is the most effective way to improve ${topic} skills.`
        }
      ],
      completed: false
    };
  }

  private getMockFlashcards(topic: string) {
    return [
      {
        id: 'fc-1',
        front: `What are the core principles that make ${topic} effective for solving complex problems?`,
        back: `${topic} succeeds through systematic approaches that emphasize modularity, scalability, and maintainability. Key principles include separation of concerns, efficient resource utilization, and robust error handling. These principles enable developers to build reliable, performant solutions that can evolve with changing requirements while maintaining code quality and team productivity.`,
        difficulty: 'easy' as const
      },
      {
        id: 'fc-2',
        front: `How does ${topic} handle scalability challenges in high-traffic production environments?`,
        back: `${topic} addresses scalability through multiple strategies: horizontal scaling (distributing load across multiple instances), efficient resource management (optimizing memory and CPU usage), caching mechanisms (reducing redundant operations), and asynchronous processing (handling concurrent requests effectively). These approaches enable applications to maintain performance as user demand increases, while providing monitoring tools to identify and resolve bottlenecks proactively.`,
        difficulty: 'medium' as const
      },
      {
        id: 'fc-3',
        front: `What advanced optimization techniques can significantly improve ${topic} performance in enterprise applications?`,
        back: `Advanced optimization includes: 1) Algorithmic improvements (choosing optimal data structures and algorithms), 2) Memory management (reducing garbage collection overhead and memory leaks), 3) Database optimization (query optimization, connection pooling, indexing strategies), 4) Caching layers (Redis, CDNs, application-level caching), 5) Code profiling and performance monitoring, 6) Microservices architecture for better resource allocation. These techniques can improve performance by 10-100x when applied systematically.`,
        difficulty: 'hard' as const
      },
      {
        id: 'fc-4',
        front: `What are the most common security vulnerabilities in ${topic} applications and how can they be prevented?`,
        back: `Common vulnerabilities include: 1) Input validation failures (prevent with sanitization and validation), 2) Authentication/authorization flaws (implement proper session management and access controls), 3) Data exposure (use encryption and secure communication), 4) Dependency vulnerabilities (regular updates and security audits), 5) Configuration errors (secure defaults and environment-specific settings). Prevention requires security-first design, regular testing, code reviews, and staying updated with security best practices and patches.`,
        difficulty: 'medium' as const
      },
      {
        id: 'fc-5',
        front: `How do you design maintainable and testable ${topic} applications?`,
        back: `Maintainable design principles: 1) Modular architecture (single responsibility, loose coupling), 2) Clear documentation and naming conventions, 3) Comprehensive testing strategy (unit, integration, end-to-end), 4) Version control best practices, 5) Code review processes, 6) Continuous integration/deployment, 7) Monitoring and logging. These practices reduce technical debt, enable team collaboration, and ensure long-term project success by making code easier to understand, modify, and extend.`,
        difficulty: 'medium' as const
      },
      {
        id: 'fc-6',
        front: `What debugging strategies are most effective when troubleshooting complex ${topic} issues?`,
        back: `Effective debugging approach: 1) Reproduce the issue consistently, 2) Use appropriate debugging tools and logging, 3) Apply systematic elimination (isolate components), 4) Check recent changes and dependencies, 5) Review error messages and stack traces carefully, 6) Use performance profiling tools, 7) Test hypotheses methodically, 8) Document findings for future reference. This systematic approach saves time and builds deeper understanding of system behavior.`,
        difficulty: 'easy' as const
      },
      {
        id: 'fc-7',
        front: `How does ${topic} integrate with modern DevOps practices and cloud infrastructure?`,
        back: `${topic} integrates through: 1) Containerization (Docker, Kubernetes for consistent deployment), 2) CI/CD pipelines (automated testing and deployment), 3) Infrastructure as Code (Terraform, CloudFormation), 4) Monitoring and observability (metrics, logging, tracing), 5) Auto-scaling and load balancing, 6) Security scanning and compliance, 7) Multi-environment management. This integration enables reliable, scalable, and maintainable applications in cloud environments.`,
        difficulty: 'hard' as const
      },
      {
        id: 'fc-8',
        front: `What emerging trends and future developments should ${topic} practitioners be aware of?`,
        back: `Key trends include: 1) AI/ML integration (automated optimization, intelligent monitoring), 2) Serverless and edge computing adoption, 3) Enhanced security frameworks and zero-trust architectures, 4) Improved developer experience tools, 5) Sustainability and green computing practices, 6) Advanced observability and AIOps, 7) Low-code/no-code integration capabilities. Staying current with these trends ensures competitive advantage and career growth in the evolving technology landscape.`,
        difficulty: 'hard' as const
      }
    ];
  }
}
// This service will handle API calls to various educational content sources
// Add your API keys and implement actual API calls here

export class SearchService {
  private static instance: SearchService;
  
  // API Configuration - Add your API keys here
  private readonly YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  private readonly GOOGLE_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY || '';
  private readonly GOOGLE_SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID || '';
  
  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  // YouTube API Integration
  async searchYouTubeVideos(query: string, maxResults: number = 5) {
    try {
      if (!this.YOUTUBE_API_KEY) {
        console.warn('YouTube API key not found, using mock data');
        return this.getMockYouTubeVideos(query);
      }

      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.YOUTUBE_API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error(`YouTube API error: ${searchResponse.status}`);
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
      if (!this.OPENAI_API_KEY) {
        console.warn('OpenAI API key not found, using mock data');
        return this.getMockQuiz(topic);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an educational quiz generator. Create a ${difficulty} level quiz about ${topic} with exactly 5 multiple choice questions. Return ONLY a valid JSON object with this structure:
              {
                "title": "Quiz Title",
                "questions": [
                  {
                    "question": "Question text",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswer": 0,
                    "explanation": "Explanation of the correct answer"
                  }
                ]
              }`
            },
            {
              role: 'user',
              content: `Generate a ${difficulty} level quiz about ${topic}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const quizData = JSON.parse(data.choices[0].message.content);
      
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
      console.error('Quiz generation error:', error);
      return this.getMockQuiz(topic);
    }
  }

  // AI-powered Flashcard Generation
  async generateFlashcards(topic: string) {
    try {
      if (!this.OPENAI_API_KEY) {
        console.warn('OpenAI API key not found, using mock data');
        return this.getMockFlashcards(topic);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an educational flashcard generator. Create exactly 8 flashcards about ${topic}. Return ONLY a valid JSON array with this structure:
              [
                {
                  "front": "Question or term",
                  "back": "Answer or definition",
                  "difficulty": "easy|medium|hard"
                }
              ]`
            },
            {
              role: 'user',
              content: `Generate 8 educational flashcards about ${topic}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const flashcards = JSON.parse(data.choices[0].message.content);
      
      return flashcards.map((card: any, index: number) => ({
        id: `fc-${index + 1}`,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty || 'medium'
      }));
    } catch (error) {
      console.error('Flashcard generation error:', error);
      return this.getMockFlashcards(topic);
    } catch (error) {
      console.error('Flashcard generation error:', error);
      return this.getMockFlashcards(topic);
    }
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
      title: `${topic} Knowledge Check`,
      questions: [
        {
          id: 'q1',
          question: `What is the primary purpose of ${topic}?`,
          options: [
            'To solve complex computational problems',
            'To improve user experience',
            'To reduce system costs',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: `${topic} serves multiple purposes including solving problems, improving UX, and reducing costs.`
        },
        {
          id: 'q2',
          question: `Which of the following is a key characteristic of ${topic}?`,
          options: [
            'High scalability',
            'Low latency',
            'Easy implementation',
            'Cost effectiveness'
          ],
          correctAnswer: 0,
          explanation: `Scalability is one of the most important characteristics of ${topic}.`
        }
      ],
      completed: false
    };
  }

  private getMockFlashcards(topic: string) {
    return [
      {
        id: 'fc-1',
        front: `What is ${topic}?`,
        back: `${topic} is a fundamental concept that involves systematic approaches to problem-solving and optimization.`,
        difficulty: 'easy' as const
      },
      {
        id: 'fc-2',
        front: `Key benefits of ${topic}`,
        back: 'Improved efficiency, better scalability, reduced complexity, and enhanced user experience.',
        difficulty: 'medium' as const
      },
      {
        id: 'fc-3',
        front: `Advanced ${topic} techniques`,
        back: 'Include optimization algorithms, machine learning integration, and distributed processing methods.',
        difficulty: 'hard' as const
      }
    ];
  }
}
# StudyOne - One-Stop Learning Hub

A comprehensive learning platform that provides students with curated educational resources and AI-powered learning tools for any topic.

## Features

### 🔍 Research Assistant
- **Multi-format Content Search**: Find YouTube videos, articles, and research papers for any topic
- **AI-powered Quiz Generation**: Automatically generated quizzes with explanations
- **Smart Flashcards**: AI-created flashcards for effective memorization
- **Real-time Results**: Live search across multiple educational sources

### 🧠 AI Note-Taking Assistant
- **Video Analysis**: Generate comprehensive notes from YouTube videos with timestamps
- **Article Analysis**: Extract key insights and create structured notes from articles
- **PDF Processing**: Analyze research papers and documents with page references
- **Multi-format Export**: Download notes as PDF, Word, Text, or Markdown files
- **Smart Organization**: Structured notes with summaries, key points, and definitions

### 📚 Core Learning Tools
- **Video Library**: Curated YouTube content with key timestamps
- **Document Viewer**: PDF support with AI summaries and key takeaways
- **Interactive Quizzes**: Multiple-choice questions with instant feedback
- **Learning Paths**: Structured Watch → Read → Test progression
- **Progress Tracking**: Monitor completion across all content types

### 🎯 Smart Features
- **Bookmark System**: Save and organize favorite resources
- **AI Summaries**: Automatic generation of notes, mind maps, and flashcards
- **Progress Analytics**: Track learning achievements and streaks
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- API keys for external services (see API Setup below)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studyone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start the development server:
```bash
npm run dev
```

## API Setup

To enable the research assistant functionality, you'll need to obtain API keys for:

### Required APIs

1. **YouTube Data API v3**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable YouTube Data API v3
   - Create credentials and copy the API key
   - Add to `.env` as `VITE_YOUTUBE_API_KEY`

2. **Google Custom Search API**
   - Enable Custom Search API in Google Cloud Console
   - Create a Custom Search Engine at [cse.google.com](https://cse.google.com/)
   - Get your Search Engine ID and API key
   - Add to `.env` as `REACT_APP_GOOGLE_SEARCH_API_KEY` and `REACT_APP_GOOGLE_SEARCH_ENGINE_ID`

3. **OpenAI API** (for AI features)
   - Sign up at [OpenAI](https://openai.com/api/)
   - Generate an API key
   - Add to `.env` as `REACT_APP_OPENAI_API_KEY`

### Optional APIs

- **PubMed API**: For medical/scientific research papers
- **arXiv API**: For academic preprints
- **CrossRef API**: For academic paper metadata

## Architecture

### Frontend Structure
```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Main navigation
│   ├── Dashboard.tsx    # Overview dashboard
│   ├── SearchInterface.tsx  # Research search UI
│   ├── SearchResults.tsx    # Search results display
│   └── ...
├── services/           # API integration
│   └── searchService.ts    # External API calls
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── data/               # Mock data and constants
```

### Key Components

- **SearchService**: Handles all external API calls with fallback to mock data
- **SearchInterface**: Clean search UI with history and popular topics
- **SearchResults**: Tabbed interface for videos, articles, papers, quizzes, and flashcards
- **Progress Tracking**: Local storage-based progress management

## Customization

### Adding New Content Sources

1. Extend the `SearchService` class in `src/services/searchService.ts`
2. Add new API integration methods
3. Update the UI components to display new content types
4. Add corresponding TypeScript types

### Styling

The app uses Tailwind CSS with a custom design system:
- Primary: Blue (#2563EB)
- Secondary: Purple (#7C3AED)
- Accent: Emerald (#10B981)
- Comprehensive color ramps for all UI states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

Built with React, TypeScript, and Tailwind CSS. Powered by multiple educational APIs and AI services.
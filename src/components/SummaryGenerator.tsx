import React, { useState } from 'react';
import { Lightbulb, FileText, GitBranch, Layers, Sparkles } from 'lucide-react';

interface SummaryGeneratorProps {
  sourceTitle: string;
  sourceType: 'video' | 'document';
}

const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({ sourceTitle, sourceType }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'mindmap' | 'flashcards'>('notes');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async (type: string) => {
    setIsGenerating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const mockNotes = `
# ${sourceTitle} - Study Notes

## Key Concepts
- **Primary Focus**: Understanding the fundamental principles and their practical applications
- **Core Methodology**: Step-by-step approach to problem-solving
- **Important Relationships**: How different concepts interconnect and influence each other

## Main Points
1. **Foundation Building**: Essential background knowledge required
2. **Practical Applications**: Real-world examples and use cases
3. **Advanced Concepts**: Higher-level thinking and analysis
4. **Implementation**: How to apply these concepts effectively

## Summary
This content provides a comprehensive overview of the topic, establishing both theoretical understanding and practical skills needed for mastery.
  `;

  const mockFlashcards = [
    { front: 'What is the main concept?', back: 'The foundational principle that underlies all other aspects of this topic.' },
    { front: 'Key application?', back: 'Primary real-world use case that demonstrates practical value.' },
    { front: 'Important relationship?', back: 'How this concept connects to and influences related topics.' },
    { front: 'Best practice?', back: 'Recommended approach for optimal implementation and results.' },
  ];

  const tabs = [
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'mindmap', label: 'Mind Map', icon: GitBranch },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            AI-Generated Summary
          </h3>
          <button
            onClick={() => generateSummary(activeTab)}
            disabled={isGenerating}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
        
        <div className="flex space-x-1 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {isGenerating ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Generating {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...</span>
          </div>
        ) : (
          <>
            {activeTab === 'notes' && (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{mockNotes}</pre>
              </div>
            )}

            {activeTab === 'mindmap' && (
              <div className="text-center py-12">
                <GitBranch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Mind Map View</h4>
                <p className="text-gray-600 mb-6">Interactive mind map visualization would be displayed here with connected concepts and relationships.</p>
                <div className="bg-gray-50 rounded-lg p-8">
                  <div className="text-center text-gray-500">
                    Interactive mind map visualization coming soon
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'flashcards' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockFlashcards.map((card, index) => (
                    <div key={index} className="group">
                      <div className="relative preserve-3d group-hover:rotate-y-180 w-full h-32 duration-500">
                        <div className="absolute inset-0 w-full h-full rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-center justify-center backface-hidden">
                          <p className="text-sm font-medium text-blue-900 text-center">{card.front}</p>
                        </div>
                        <div className="absolute inset-0 w-full h-full rounded-lg bg-blue-600 text-white p-4 flex items-center justify-center rotate-y-180 backface-hidden">
                          <p className="text-sm text-center">{card.back}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">Hover over cards to reveal answers</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SummaryGenerator;
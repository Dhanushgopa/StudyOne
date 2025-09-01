import React, { useState } from 'react';
import { Brain, FileText, Video, Upload, Loader2, Sparkles } from 'lucide-react';
import { NoteService } from '../services/noteService';
import { StudyNote } from '../types';
import NoteViewer from './NoteViewer';

const NoteGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'article' | 'pdf'>('video');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<StudyNote | null>(null);
  const [formData, setFormData] = useState({
    videoUrl: '',
    videoTitle: '',
    articleContent: '',
    articleTitle: '',
    articleUrl: '',
    pdfFile: null as File | null,
    pdfTitle: ''
  });

  const noteService = NoteService.getInstance();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let note: StudyNote;
      
      switch (activeTab) {
        case 'video':
          if (!formData.videoUrl || !formData.videoTitle) {
            alert('Please provide both video URL and title');
            return;
          }
          note = await noteService.analyzeVideo(formData.videoUrl, formData.videoTitle);
          break;
          
        case 'article':
          if (!formData.articleContent || !formData.articleTitle) {
            alert('Please provide both article content and title');
            return;
          }
          note = await noteService.analyzeArticle(
            formData.articleContent, 
            formData.articleTitle, 
            formData.articleUrl
          );
          break;
          
        case 'pdf':
          if (!formData.pdfFile || !formData.pdfTitle) {
            alert('Please provide both PDF file and title');
            return;
          }
          // For demo purposes, we'll use a placeholder URL
          note = await noteService.analyzePDF('placeholder-url', formData.pdfTitle);
          break;
          
        default:
          throw new Error('Invalid tab selection');
      }
      
      setGeneratedNote(note);
    } catch (error) {
      console.error('Note generation failed:', error);
      alert('Failed to generate notes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'video', label: 'Video Analysis', icon: Video },
    { id: 'article', label: 'Article Analysis', icon: FileText },
    { id: 'pdf', label: 'PDF Analysis', icon: Upload },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Brain className="h-8 w-8 mr-3 text-purple-600" />
          AI Note Generator
        </h2>
        <p className="text-gray-600">
          Generate comprehensive, structured notes from videos, articles, and PDF documents using AI analysis.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-purple-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
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
          {/* Video Analysis Tab */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (YouTube, Vimeo, etc.)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={formData.videoTitle}
                  onChange={(e) => handleInputChange('videoTitle', e.target.value)}
                  placeholder="Enter the video title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Comprehensive summary of video content</li>
                  <li>• Key timestamps with important points</li>
                  <li>• Structured notes with sections and subsections</li>
                  <li>• Important definitions and concepts</li>
                  <li>• Downloadable notes in multiple formats</li>
                </ul>
              </div>
            </div>
          )}

          {/* Article Analysis Tab */}
          {activeTab === 'article' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  value={formData.articleTitle}
                  onChange={(e) => handleInputChange('articleTitle', e.target.value)}
                  placeholder="Enter the article title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.articleUrl}
                  onChange={(e) => handleInputChange('articleUrl', e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content
                </label>
                <textarea
                  value={formData.articleContent}
                  onChange={(e) => handleInputChange('articleContent', e.target.value)}
                  placeholder="Paste the full article content here..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-medium text-emerald-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-emerald-800 space-y-1">
                  <li>• Structured summary with key insights</li>
                  <li>• Important quotes and references</li>
                  <li>• Key points with page references</li>
                  <li>• Definitions of technical terms</li>
                  <li>• Organized sections for easy review</li>
                </ul>
              </div>
            </div>
          )}

          {/* PDF Analysis Tab */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={formData.pdfTitle}
                  onChange={(e) => handleInputChange('pdfTitle', e.target.value)}
                  placeholder="Enter the document title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF Document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors duration-200">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleInputChange('pdfFile', e.target.files?.[0] || null)}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Click to upload PDF
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.pdfFile ? formData.pdfFile.name : 'PDF files up to 10MB'}
                  </p>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Complete document analysis and summary</li>
                  <li>• Key findings with page references</li>
                  <li>• Important quotes and citations</li>
                  <li>• Technical definitions and terminology</li>
                  <li>• Structured notes by document sections</li>
                </ul>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate AI Notes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Note Viewer Modal */}
      {generatedNote && (
        <NoteViewer
          note={generatedNote}
          onClose={() => setGeneratedNote(null)}
        />
      )}
    </div>
  );
};

export default NoteGenerator;
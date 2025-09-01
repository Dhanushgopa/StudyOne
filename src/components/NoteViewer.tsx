import React, { useState } from 'react';
import { FileText, Download, Clock, Quote, Lightbulb, BookOpen, ExternalLink, Copy, Check } from 'lucide-react';
import { StudyNote } from '../types';
import { NoteService } from '../services/noteService';

interface NoteViewerProps {
  note: StudyNote;
  onClose: () => void;
}

const NoteViewer: React.FC<NoteViewerProps> = ({ note, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'export'>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  const noteService = NoteService.getInstance();

  const handleExport = async (format: 'pdf' | 'docx' | 'txt' | 'md') => {
    setIsExporting(true);
    try {
      const blob = await noteService.exportNotes(note, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Lightbulb },
    { id: 'detailed', label: 'Detailed Notes', icon: FileText },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <span className="capitalize">{note.sourceType}</span>
                {note.sourceUrl && (
                  <a
                    href={note.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-white transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Source
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
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
                      ? 'text-blue-600 border-blue-600'
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

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                  Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{note.content.summary}</p>
              </div>

              {/* Key Points */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                  Key Points
                </h3>
                <div className="space-y-3">
                  {note.content.keyPoints.map((point, index) => (
                    <div
                      key={point.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        point.importance === 'high'
                          ? 'bg-red-50 border-red-400'
                          : point.importance === 'medium'
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-green-50 border-green-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{point.text}</p>
                          {(point.timestamp || point.pageReference) && (
                            <p className="text-sm text-gray-600 mt-1">
                              {point.timestamp && `⏱️ ${point.timestamp}`}
                              {point.pageReference && ` 📄 ${point.pageReference}`}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => copyToClipboard(point.text, point.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {copiedSection === point.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Definitions */}
              {note.content.definitions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Definitions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {note.content.definitions.map((definition, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{definition.term}</h4>
                        <p className="text-sm text-gray-700">{definition.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              {note.content.timestamps && note.content.timestamps.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Timestamps</h3>
                  <div className="space-y-2">
                    {note.content.timestamps.map((timestamp, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-mono text-blue-600 mr-3 min-w-[60px]">
                          {timestamp.time}
                        </span>
                        <span className="text-sm text-gray-700">{timestamp.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotes */}
              {note.content.quotes && note.content.quotes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Quote className="h-5 w-5 mr-2 text-purple-600" />
                    Key Quotes
                  </h3>
                  <div className="space-y-4">
                    {note.content.quotes.map((quote) => (
                      <blockquote key={quote.id} className="border-l-4 border-purple-400 bg-purple-50 p-4 rounded-r-lg">
                        <p className="text-gray-800 italic mb-2">"{quote.text}"</p>
                        <footer className="text-sm text-gray-600">
                          — {quote.source}
                          {quote.pageReference && ` (${quote.pageReference})`}
                          {quote.timestamp && ` • ${quote.timestamp}`}
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'detailed' && (
            <div className="space-y-6">
              {note.content.sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      {section.title}
                      {section.timestamp && (
                        <span className="ml-2 text-sm text-blue-600 font-mono">
                          {section.timestamp}
                        </span>
                      )}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(`${section.title}\n\n${section.content}`, section.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {copiedSection === section.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                  
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-4 ml-4">
                      {section.subsections.map((subsection) => (
                        <div key={subsection.id} className="border-l-2 border-gray-200 pl-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            {subsection.title}
                            {subsection.timestamp && (
                              <span className="ml-2 text-sm text-blue-600 font-mono">
                                {subsection.timestamp}
                              </span>
                            )}
                          </h4>
                          <p className="text-gray-600 text-sm">{subsection.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Your Notes</h3>
                <p className="text-gray-600 mb-6">Choose your preferred format to download the notes</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { format: 'pdf', label: 'PDF', icon: '📄', description: 'Formatted document' },
                  { format: 'docx', label: 'Word', icon: '📝', description: 'Editable document' },
                  { format: 'txt', label: 'Text', icon: '📋', description: 'Plain text file' },
                  { format: 'md', label: 'Markdown', icon: '📖', description: 'Markdown format' },
                ].map((option) => (
                  <button
                    key={option.format}
                    onClick={() => handleExport(option.format as any)}
                    disabled={isExporting}
                    className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </button>
                ))}
              </div>

              {isExporting && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Preparing download...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteViewer;
import React, { useState } from 'react';
import { FileText, CheckCircle, ExternalLink, Lightbulb, BookOpen } from 'lucide-react';
import { Document } from '../types';
import { useLearningProgress } from '../hooks/useLearningProgress';

interface DocumentViewerProps {
  documents: Document[];
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(documents[0] || null);
  const { completedDocuments, markDocumentComplete } = useLearningProgress();

  const handleDocumentComplete = (documentId: string) => {
    markDocumentComplete(documentId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Document Library</h2>
        <p className="text-gray-600">Access research papers and articles with AI-powered summaries and key insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Documents</h3>
            <div className="space-y-3">
              {documents.map((document) => {
                const isCompleted = completedDocuments.includes(document.id);
                const isSelected = selectedDocument?.id === document.id;
                
                return (
                  <button
                    key={document.id}
                    onClick={() => setSelectedDocument(document)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      isSelected 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${document.type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                        <FileText className={`h-4 w-4 ${document.type === 'pdf' ? 'text-red-600' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {document.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 uppercase">{document.type}</span>
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="lg:col-span-2">
          {selectedDocument && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedDocument.title}</h3>
                  <div className="flex items-center space-x-3">
                    {selectedDocument.url !== '#' && (
                      <a
                        href={selectedDocument.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Original
                      </a>
                    )}
                    {!completedDocuments.includes(selectedDocument.id) && (
                      <button
                        onClick={() => handleDocumentComplete(selectedDocument.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>

                {completedDocuments.includes(selectedDocument.id) && (
                  <div className="flex items-center text-emerald-600 mb-4">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* AI Summary */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    AI Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{selectedDocument.summary}</p>
                </div>

                {/* Key Takeaways */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {selectedDocument.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Definitions */}
                {selectedDocument.definitions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Important Definitions</h4>
                    <div className="space-y-3">
                      {selectedDocument.definitions.map((definition, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-1">{definition.term}</h5>
                          <p className="text-sm text-gray-700">{definition.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
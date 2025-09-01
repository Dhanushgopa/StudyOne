import React, { useState, useRef } from 'react';
import { Download, Save, Type, Bold, Italic, List, Clock, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface VideoNoteEditorProps {
  videoId: string;
  videoTitle: string;
  onClose: () => void;
}

const VideoNoteEditor: React.FC<VideoNoteEditorProps> = ({ videoId, videoTitle, onClose }) => {
  const [notes, setNotes] = useState('');
  const [timestamps, setTimestamps] = useState<Array<{ time: string; note: string }>>([]);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isFormatting, setIsFormatting] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addTimestamp = () => {
    if (notes.trim()) {
      const newTimestamp = {
        time: currentTime,
        note: notes.trim()
      };
      setTimestamps([...timestamps, newTimestamp]);
      setNotes('');
    }
  };

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = notes.substring(start, end);
    
    if (selectedText) {
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'bullet':
          formattedText = `• ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const newNotes = notes.substring(0, start) + formattedText + notes.substring(end);
      setNotes(newNotes);
    }
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Notes: ${videoTitle}`, margin, yPosition);
    yPosition += 15;

    // Date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Created: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Current notes section
    if (notes.trim()) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Current Notes:', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const currentNotesLines = pdf.splitTextToSize(notes, pageWidth - 2 * margin);
      pdf.text(currentNotesLines, margin, yPosition);
      yPosition += currentNotesLines.length * 5 + 15;
    }

    // Timestamped notes
    if (timestamps.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Timestamped Notes:', margin, yPosition);
      yPosition += 15;

      timestamps.forEach((timestamp, index) => {
        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.getHeight() - 40) {
          pdf.addPage();
          yPosition = margin;
        }

        // Timestamp
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`[${timestamp.time}]`, margin, yPosition);
        yPosition += 8;

        // Note content
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const noteLines = pdf.splitTextToSize(timestamp.note, pageWidth - 2 * margin);
        pdf.text(noteLines, margin, yPosition);
        yPosition += noteLines.length * 5 + 10;
      });
    }

    // Save the PDF
    const fileName = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`;
    pdf.save(fileName);
  };

  const saveNotes = () => {
    const notesData = {
      videoId,
      videoTitle,
      currentNotes: notes,
      timestamps,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingNotes = JSON.parse(localStorage.getItem('video-notes') || '[]');
    const updatedNotes = [...existingNotes.filter((n: any) => n.videoId !== videoId), notesData];
    localStorage.setItem('video-notes', JSON.stringify(updatedNotes));
    
    alert('Notes saved successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Video Notes</h2>
              <p className="text-blue-100 text-sm">{videoTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Video Section */}
          <div className="w-1/2 p-4 border-r border-gray-200">
            <div className="aspect-video mb-4">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                title={videoTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
            
            {/* Time Input */}
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={currentTime}
                onChange={(e) => setCurrentTime(e.target.value)}
                placeholder="0:00"
                className="px-3 py-1 border border-gray-300 rounded text-sm w-20"
              />
              <span className="text-sm text-gray-600">Current timestamp</span>
            </div>

            {/* Timestamped Notes List */}
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <h4 className="font-medium text-gray-900 mb-2">Timestamped Notes</h4>
              {timestamps.length === 0 ? (
                <p className="text-sm text-gray-500">No timestamped notes yet</p>
              ) : (
                <div className="space-y-2">
                  {timestamps.map((timestamp, index) => (
                    <div key={index} className="bg-white rounded p-2 text-sm">
                      <div className="font-mono text-blue-600 text-xs mb-1">[{timestamp.time}]</div>
                      <div className="text-gray-700">{timestamp.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="w-1/2 p-4 flex flex-col">
            {/* Formatting Toolbar */}
            <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg">
              <button
                onClick={() => formatText('bold')}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('italic')}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('bullet')}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
                title="Bullet Point"
              >
                <List className="h-4 w-4" />
              </button>
              <div className="flex-1"></div>
              <button
                onClick={addTimestamp}
                className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-200"
              >
                <Clock className="h-3 w-3 mr-1" />
                Add Timestamp
              </button>
            </div>

            {/* Notes Textarea */}
            <div className="flex-1 mb-4">
              <textarea
                ref={textareaRef}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here... Select text and use the formatting buttons above, or add timestamps to organize your notes."
                className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {timestamps.length} timestamped notes
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={saveNotes}
                  className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoNoteEditor;
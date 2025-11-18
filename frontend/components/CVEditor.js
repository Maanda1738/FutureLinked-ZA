import { useState } from 'react';
import { Wand2, Download, Copy, Check, AlertCircle, Sparkles, FileText, RefreshCw } from 'lucide-react';

export default function CVEditor({ cvData, analysisData, onClose }) {
  const [editType, setEditType] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [editedCV, setEditedCV] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const editOptions = [
    {
      id: 'ats-optimize',
      title: '🎯 Optimize for ATS',
      description: 'Remove complex formatting, add standard sections, ensure ATS can parse your CV',
      priority: 'high'
    },
    {
      id: 'improve-language',
      title: '✨ Improve Language',
      description: 'Strengthen action verbs, fix grammar, make your achievements more impactful',
      priority: 'high'
    },
    {
      id: 'add-keywords',
      title: '🔑 Add Keywords',
      description: 'Add relevant industry keywords to improve job matching and searchability',
      priority: 'medium'
    },
    {
      id: 'quantify-achievements',
      title: '📊 Quantify Achievements',
      description: 'Add numbers and metrics to make your impact clear and measurable',
      priority: 'medium'
    },
    {
      id: 'complete-rewrite',
      title: '📝 Complete Rewrite',
      description: 'Professional rewrite of your entire CV to recruiter-approved standards',
      priority: 'low'
    },
    {
      id: 'custom',
      title: '⚙️ Custom Edit',
      description: 'Tell AI exactly what you want changed in your CV',
      priority: 'low'
    }
  ];

  const handleEdit = async (type) => {
    setEditType(type);
    setLoading(true);
    setError(null);
    setEditedCV(null);

    try {
      const response = await fetch('/api/edit-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          editType: type,
          customInstructions: type === 'custom' ? customInstructions : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to edit CV');
      }

      const data = await response.json();
      setEditedCV(data);

    } catch (err) {
      console.error('CV edit error:', err);
      setError(err.message || 'Failed to edit CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (editedCV && editedCV.editedText) {
      navigator.clipboard.writeText(editedCV.editedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (editedCV && editedCV.editedText) {
      const blob = new Blob([editedCV.editedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'edited-cv.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Wand2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-black">AI CV Editor</h2>
                <p className="text-purple-100 text-sm">Transform your CV with AI-powered improvements</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* ATS Score Banner */}
          {analysisData && (
            <div className={`mb-6 p-4 rounded-xl border-2 ${
              analysisData.atsScore >= 80 
                ? 'bg-green-50 border-green-300' 
                : analysisData.atsScore >= 60 
                ? 'bg-yellow-50 border-yellow-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Current ATS Score</h3>
                  <p className="text-sm text-gray-600">{analysisData.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black" style={{
                    color: analysisData.atsScore >= 80 ? '#16a34a' : analysisData.atsScore >= 60 ? '#ca8a04' : '#dc2626'
                  }}>
                    {analysisData.atsScore}%
                  </div>
                  <div className="text-xs text-gray-600">ATS Compatible</div>
                </div>
              </div>
            </div>
          )}

          {!editedCV ? (
            <>
              {/* Edit Options */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Choose an AI Improvement
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {editOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => option.id === 'custom' ? setEditType('custom') : handleEdit(option.id)}
                      disabled={loading}
                      className={`text-left p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                        option.priority === 'high' 
                          ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-500' 
                          : option.priority === 'medium'
                          ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 hover:border-blue-500'
                          : 'border-gray-300 bg-gray-50 hover:border-gray-500'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        {option.title}
                        {option.priority === 'high' && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">RECOMMENDED</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Instructions */}
              {editType === 'custom' && (
                <div className="mb-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-300">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    What would you like to change?
                  </h4>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="E.g., 'Make my job titles more impressive', 'Add more technical skills', 'Rewrite my summary to focus on leadership'..."
                    className="w-full p-4 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 min-h-[120px] resize-none"
                  />
                  <button
                    onClick={() => handleEdit('custom')}
                    disabled={!customInstructions.trim() || loading}
                    className="mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Wand2 className="w-5 h-5" />
                    Apply Custom Edits
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 px-8 py-4 rounded-xl">
                    <RefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
                    <span className="font-bold text-gray-800">AI is editing your CV...</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-800 mb-1">Edit Failed</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-900 mb-2">{editedCV.message}</h3>
                    <p className="text-green-800 mb-4">{editedCV.improvements}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-bold text-green-900">Changes Made:</h4>
                      <ul className="space-y-1">
                        {editedCV.changes.map((change, idx) => (
                          <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-white border-2 border-green-300 text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download CV
                  </button>
                </div>
              </div>

              {/* Edited CV Display */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Original */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Original CV
                  </h4>
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {editedCV.originalText}
                    </pre>
                  </div>
                </div>

                {/* Edited */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI-Edited CV
                  </h4>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                      {editedCV.editedText}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Try Another Edit */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setEditedCV(null);
                    setEditType('');
                    setError(null);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-colors inline-flex items-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  Try Another Improvement
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

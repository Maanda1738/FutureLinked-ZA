/**
 * JBM CV Analyzer Component
 * Upload and analyze CV with quality scoring
 */

import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';

export default function CVAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.docx'))) {
      setFile(selectedFile);
      setAnalysis(null);
    } else {
      alert('Please upload a PDF or DOCX file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch('/api/jbm/analyze-cv', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        alert('Failed to analyze CV: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">CV Analyzer</h2>
          <p className="text-gray-600">Get instant feedback on your CV quality</p>
        </div>
      </div>

      {/* Upload Section */}
      {!analysis && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-semibold">
                Choose a file
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
              />
            </label>
            <p className="text-gray-500 text-sm mt-2">PDF or DOCX (max 10MB)</p>
            {file && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Analyze CV
              </>
            )}
          </button>
        </div>
      )}

      {/* Results Section */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall CV Score</h3>
                <p className="text-gray-600">Your CV quality rating</p>
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.score).split(' ')[0]}`}>
                {analysis.score}
                <span className="text-2xl">/100</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid md:grid-cols-3 gap-4">
            {analysis.scoreBreakdown && Object.entries(analysis.scoreBreakdown).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`font-bold ${getScoreColor(value)}`}>{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getScoreColor(value).split(' ')[1]}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Improvements */}
          {analysis.improvements && analysis.improvements.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Suggested Improvements</h3>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold">•</span>
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Parsed Data */}
          {analysis.cvData && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Parsed Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {analysis.cvData.name && (
                  <div>
                    <span className="font-semibold text-gray-600">Name:</span>
                    <span className="ml-2 text-gray-800">{analysis.cvData.name}</span>
                  </div>
                )}
                {analysis.cvData.email && (
                  <div>
                    <span className="font-semibold text-gray-600">Email:</span>
                    <span className="ml-2 text-gray-800">{analysis.cvData.email}</span>
                  </div>
                )}
                {analysis.cvData.skills && analysis.cvData.skills.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-semibold text-gray-600">Skills:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.cvData.skills.slice(0, 10).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => { setFile(null); setAnalysis(null); }}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Analyze Another CV
            </button>
            <button
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => {/* Navigate to job matching */}}
            >
              Find Matching Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

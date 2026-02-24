/**
 * JBM Interview Prep Component
 * Interview question generator and preparation assistant
 */

import { useState } from 'react';
import { MessageSquare, Lightbulb, Building, Loader2, CheckCircle } from 'lucide-react';

export default function InterviewPrep() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [prep, setPrep] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerate = async () => {
    if (!formData.jobTitle) {
      alert('Please enter a job title');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/jbm/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setPrep(data.prep);
      } else {
        alert('Failed to generate prep: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Prep generation error:', error);
      alert('Failed to generate interview prep. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-8 h-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Interview Preparation</h2>
          <p className="text-gray-600">Practice questions and expert answers</p>
        </div>
      </div>

      {/* Form */}
      {!prep && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Senior Data Analyst"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Discovery Health"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description (Optional)
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste the job description here for more targeted questions..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !formData.jobTitle}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5" />
                Generate Interview Prep
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {prep && (
        <div className="space-y-6">
          {/* Questions */}
          {prep.questions && prep.questions.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Expected Interview Questions
              </h3>
              <div className="space-y-4">
                {prep.questions.map((q, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">{q.question}</p>
                        {q.type && (
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                            {q.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Suggestions */}
          {prep.answerSuggestions && prep.answerSuggestions.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                How to Answer
              </h3>
              <div className="space-y-4">
                {prep.answerSuggestions.map((ans, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">{ans.question}</p>
                    <div className="text-gray-700 text-sm space-y-2">
                      {ans.tips && ans.tips.map((tip, tidx) => (
                        <p key={tidx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          {prep.companyInfo && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-600" />
                About the Company
              </h3>
              <p className="text-gray-700">{prep.companyInfo}</p>
            </div>
          )}

          {/* Tips */}
          {prep.generalTips && prep.generalTips.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">General Tips</h3>
              <ul className="space-y-2">
                {prep.generalTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setPrep(null)}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Generate New Prep
            </button>
            <button
              className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              onClick={() => window.print()}
            >
              Print Prep Sheet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

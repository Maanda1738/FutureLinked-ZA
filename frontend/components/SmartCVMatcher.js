import { useState } from 'react';
import { Upload, Sparkles, Target, TrendingUp, FileText, CheckCircle, AlertCircle, X, ArrowRight, Download, Wand2, AlertTriangle } from 'lucide-react';
import CVEditor from './CVEditor';

export default function SmartCVMatcher({ onJobsFound }) {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [cvDataForEdit, setCVDataForEdit] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    await processFile(file);
  };

  const processFile = async (file) => {
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setAnalysisResult(null);
    setMatchedJobs([]);

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    // Determine API URL based on environment (before try block to make it accessible throughout)
    const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    // Primary external backend (Render / other) if provided
    const externalBackend = process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim().length > 0
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
      : null;
    // Netlify function fallback path
    const netlifyFunctionBase = '/.netlify/functions/api';
    // Local dev fallback
    const localBackend = 'http://localhost:3001';
    // Decide initial target sequence
    const apiTargets = [];
    if (externalBackend) apiTargets.push(externalBackend);
    if (isProduction) apiTargets.push(netlifyFunctionBase); // only meaningful on deployed site
    apiTargets.push(localBackend); // always last fallback for local testing

    console.log('🔁 API target preference order:', apiTargets);

    try {
      // Step 1: Upload CV and extract data using BACKEND API (has working PDF parsing)
      
      const formData = new FormData();
      formData.append('cv', file);

      let uploadResultResponse = null;
      let chosenBase = null;
      let lastError = null;
      for (const base of apiTargets) {
        try {
          const url = `${base}/cv/upload`;
          console.log('📤 Attempting CV upload to:', url);
          const resp = await fetch(url, { method: 'POST', body: formData });
          if (resp.ok) {
            uploadResultResponse = resp;
            chosenBase = base;
            console.log('✅ Upload succeeded at:', base);
            break;
          } else {
            const text = await resp.text();
            console.warn(`⚠️ Upload failed at ${base} status ${resp.status}:`, text);
            lastError = new Error(text || `Upload failed with status ${resp.status}`);
            // If explicit 404 on netlify function base, keep trying others
          }
        } catch (e) {
          console.warn('⚠️ Network error on', base, e.message);
          lastError = e;
        }
      }
      if (!uploadResultResponse) {
        throw lastError || new Error('All upload targets failed');
      }

      console.log('📡 Response status:', uploadResponse.status, uploadResponse.statusText);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ Upload failed:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Failed to upload CV' };
        }
        throw new Error(errorData.error || `Upload failed with status ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResultResponse.json();
      console.log('✅ CV uploaded successfully:', uploadResult);
      
      const cvData = uploadResult.cvData || uploadResult.data || uploadResult;
      
      // Ensure CV data has text field for editor (combine all text if needed)
      if (!cvData.text && cvData.summary) {
        cvData.text = `${cvData.name || ''}\n${cvData.email || ''}\n${cvData.phone || ''}\n\n${cvData.summary || ''}\n\nSKILLS:\n${(cvData.skills || []).join(', ')}\n\nEXPERIENCE:\n${(cvData.experience?.roles || []).map(r => `${r.title} at ${r.company}\n${r.description || ''}`).join('\n\n')}\n\nEDUCATION:\n${(cvData.education || []).map(e => `${e.degree || e.field} at ${e.institution}`).join('\n')}`;
      }
      
      // Store CV data for editor
      setCVDataForEdit(cvData);
      
      setUploading(false);
      setAnalyzing(true);

      // Step 2: Analyze CV and get suggestions
      const analysisResponse = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze CV');
      }

      const analysis = await analysisResponse.json();
      setAnalysisResult(analysis);

      // Step 3: Extract skills and intelligently determine job search queries
      const topSkills = cvData.skills?.slice(0, 5) || [];
      const rawDesiredRoles = cvData.desiredRoles || analysis.targetRoles || [];
      
      // Detect seniority level from CV
      const cvText = (cvData.text || cvData.summary || '').toLowerCase();
      const isJunior = cvText.includes('junior') || cvText.includes('entry') || cvText.includes('graduate') || 
                       cvText.includes('intern') || cvText.includes('beginner') || cvText.includes('fresher');
      const experienceYears = cvData.totalExperience || 0;
      
      // Build smart search queries prioritizing job titles
      let searchQueries = [];
      
      // Detect if CV is for data analyst roles
      const isDataAnalyst = cvText.includes('data analyst') || cvText.includes('data analysis') ||
                            rawDesiredRoles.some(r => r.toLowerCase().includes('data analyst'));
      
      if (isDataAnalyst) {
        // Prioritize specific data analyst job title searches
        searchQueries = [
          'Junior Data Analyst',
          'Entry Level Data Analyst',
          'Graduate Data Analyst',
          'Data Analyst Intern',
          'Associate Data Analyst'
        ];
      } else if (isJunior || experienceYears < 2) {
        // For other junior roles, add junior/entry-level prefix
        searchQueries = rawDesiredRoles.slice(0, 2).map(role => `Junior ${role}`);
        searchQueries.push(...rawDesiredRoles.slice(0, 2).map(role => `Entry Level ${role}`));
      } else {
        // For experienced candidates, use roles as-is
        searchQueries = rawDesiredRoles.slice(0, 3);
      }
      
      // Add top 2 relevant skills only if we have less than 3 queries
      if (searchQueries.length < 3) {
        searchQueries.push(...topSkills.slice(0, 2));
      }
      
      console.log('🎯 Smart job search for:', { isJunior, isDataAnalyst, experienceYears, searchQueries });

      let allJobs = [];
      
      // Use the same API_URL that was defined at the start of processFile
      // For searching reuse the successful base if available; else iterate targets until success per query
      const searchBasePreference = chosenBase ? [chosenBase, ...apiTargets.filter(b => b !== chosenBase)] : apiTargets;
      for (const query of searchQueries) {
        let searchSuccess = false;
        for (const base of searchBasePreference) {
          try {
            const searchUrl = `${base}/search?q=${encodeURIComponent(query)}&limit=10&source=all`;
            const searchResponse = await fetch(searchUrl);
            if (searchResponse.ok) {
              const searchData = await searchResponse.json();
              if (searchData.results) {
                allJobs.push(...searchData.results);
                searchSuccess = true;
                break;
              }
            } else {
              console.warn('Search failed at', base, 'status', searchResponse.status);
            }
          } catch (err) {
            console.warn(`Network error searching '${query}' at ${base}:`, err.message);
          }
        }
        if (!searchSuccess) console.warn('❌ All search targets failed for query:', query);
      }

      // Step 5: Remove duplicates, filter inappropriate jobs, and score matches
      const uniqueJobs = [];
      const seenIds = new Set();
      
      // Keywords to filter out senior/unsuitable positions
      const seniorKeywords = ['senior', 'lead', 'principal', 'head of', 'director', 'manager', 'chief', 
                              'vp', 'vice president', '5+ years', '5 years', '3+ years'];
      
      for (const job of allJobs) {
        const jobId = job.id || `${job.title}-${job.company}`;
        if (!seenIds.has(jobId)) {
          const jobTitle = (job.title || '').toLowerCase();
          const jobDesc = (job.description || '').toLowerCase();
          const jobText = `${jobTitle} ${jobDesc} ${job.company || ''}`.toLowerCase();
          
          // Filter out senior positions for junior candidates
          if (isJunior && seniorKeywords.some(keyword => jobTitle.includes(keyword))) {
            console.log(`⛔ Filtered out senior role: ${job.title}`);
            continue;
          }
          
          seenIds.add(jobId);
          
          // Calculate match score with better weighting
          let matchScore = 30; // Lower base score
          
          // Job title exact/close matches (+30 for exact, +20 for partial)
          if (isDataAnalyst) {
            if (jobTitle.includes('junior data analyst') || jobTitle.includes('entry level data analyst')) {
              matchScore += 40; // Perfect match
            } else if (jobTitle.includes('data analyst') && !seniorKeywords.some(k => jobTitle.includes(k))) {
              matchScore += 30; // Good match
            } else if (jobTitle.includes('analyst')) {
              matchScore += 15; // Partial match
            }
          }
          
          // Seniority level match bonus
          if (isJunior) {
            if (jobTitle.includes('junior') || jobTitle.includes('entry') || jobTitle.includes('graduate')) {
              matchScore += 15;
            }
          }
          
          // Skill matches (+3 per skill in title, +2 in description)
          topSkills.forEach(skill => {
            if (jobTitle.includes(skill.toLowerCase())) {
              matchScore += 3;
            } else if (jobDesc.includes(skill.toLowerCase())) {
              matchScore += 2;
            }
          });
          
          // Role matches (+10 per role)
          rawDesiredRoles.forEach(role => {
            if (jobText.includes(role.toLowerCase())) {
              matchScore += 10;
            }
          });
          
          uniqueJobs.push({
            ...job,
            matchScore: Math.min(100, matchScore)
          });
        }
      }
      
      // Sort by match score
      const rankedJobs = uniqueJobs
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20); // Top 20 matches
      
      setMatchedJobs(rankedJobs);
      console.log(`✅ Found ${rankedJobs.length} matching jobs`);
      
      setAnalyzing(false);

    } catch (err) {
      console.error('Error processing CV:', err);
      setError(err.message || 'Failed to process CV. Please try again.');
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const clearUpload = () => {
    setFileName('');
    setError(null);
    setAnalysisResult(null);
    setMatchedJobs([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black">AI-Powered CV Job Matcher</h2>
            <p className="text-indigo-100 text-sm font-medium">Upload your CV • Get matched with perfect jobs • Receive CV improvement tips</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {!analysisResult ? (
          <>
            {/* Upload Area */}
            <div
              className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50 scale-105'
                  : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!uploading && !analyzing ? (
                <>
                  <Upload className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {fileName ? fileName : 'Drop your CV here or click to upload'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Supports PDF, DOC, DOCX • Max 10MB
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105">
                    <Upload className="w-5 h-5" />
                    Choose File
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {uploading ? '📤 Uploading your CV...' : '🤖 AI is analyzing your CV...'}
                    </h3>
                    <p className="text-gray-600">
                      {uploading 
                        ? 'Please wait while we process your document' 
                        : 'Extracting skills, experience, and finding perfect job matches'}
                    </p>
                  </div>
                  <div className="max-w-md mx-auto bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500 animate-pulse"
                      style={{ width: uploading ? '50%' : '75%' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-red-800 mb-1">Upload Failed</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button onClick={clearUpload} className="text-red-600 hover:text-red-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Analysis Results */}
            <div className="space-y-6">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-900 mb-2">CV Analysis Complete!</h3>
                    <p className="text-green-800">
                      Found <span className="font-bold text-2xl">{matchedJobs.length}</span> jobs that perfectly match your profile
                    </p>
                  </div>
                  <button 
                    onClick={clearUpload}
                    className="px-4 py-2 bg-white border-2 border-green-300 rounded-lg font-semibold text-green-700 hover:bg-green-50 transition-colors"
                  >
                    Upload New CV
                  </button>
                </div>
              </div>

              {/* CV Strength Score with ATS Score */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">CV Analysis Scores</h3>
                    <p className="text-gray-600 text-sm">
                      {analysisResult.aiPowered ? (
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          Powered by OpenAI GPT-4
                        </span>
                      ) : (
                        'Based on professional analysis'
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Overall Score */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Overall Score</span>
                    <span className="text-sm font-bold text-indigo-600">{analysisResult.score}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${analysisResult.score || 0}%` }}
                    />
                  </div>
                </div>

                {/* ATS Score */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      ATS Compatibility
                      {analysisResult.atsScore < 70 && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </span>
                    <span className={`text-sm font-bold ${
                      analysisResult.atsScore >= 80 ? 'text-green-600' :
                      analysisResult.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {analysisResult.atsScore || analysisResult.score}%
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (analysisResult.atsScore || analysisResult.score) >= 80 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                          : (analysisResult.atsScore || analysisResult.score) >= 60 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                          : 'bg-gradient-to-r from-red-500 to-pink-600'
                      }`}
                      style={{ width: `${analysisResult.atsScore || analysisResult.score || 0}%` }}
                    />
                  </div>
                </div>

                {/* AI Edit Button */}
                <div className="mt-4 pt-4 border-t border-indigo-200">
                  <button
                    onClick={() => {
                      setShowEditor(true);
                    }}
                    disabled={!cvDataForEdit}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wand2 className="w-5 h-5" />
                    Improve CV with AI Editor
                  </button>
                </div>
              </div>

              {/* CV Description */}
              {analysisResult.description && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Who You Are</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{analysisResult.description}</p>
                  {analysisResult.careerSummary && analysisResult.careerSummary.length > 20 && (
                    <div className="mt-3 pt-3 border-t border-indigo-200">
                      <p className="text-sm text-gray-600 italic">{analysisResult.careerSummary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ATS Issues (if any) */}
              {analysisResult.atsIssues && analysisResult.atsIssues.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">🚨 Critical ATS Issues</h3>
                      <p className="text-sm text-red-700">These issues prevent ATS systems from reading your CV properly</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {analysisResult.atsIssues.map((issue, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border-2 border-red-200">
                        <h4 className="font-bold text-red-800 mb-2">{issue.issue}</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Impact:</span> {issue.impact}
                        </p>
                        <p className="text-sm text-green-700">
                          <span className="font-semibold">✅ Fix:</span> {issue.fix}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowEditor(true);
                    }}
                    className="mt-4 w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-red-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-5 h-5" />
                    Fix ATS Issues with AI
                  </button>
                </div>
              )}

              {/* CV Improvement Suggestions */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">AI Suggestions to Improve Your CV</h3>
                </div>
                <div className="space-y-3">
                  {analysisResult.suggestions?.map((suggestion, idx) => (
                    <div key={idx} className={`flex items-start gap-3 bg-white rounded-lg p-4 border-2 ${
                      suggestion.priority === 'high' ? 'border-red-300' :
                      suggestion.priority === 'medium' ? 'border-yellow-300' : 'border-gray-300'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        suggestion.priority === 'high' ? 'bg-red-500' :
                        suggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        <span className="text-white font-bold text-xs">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-800">{suggestion.title}</h4>
                          {suggestion.category && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">
                              {suggestion.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Skills */}
              {analysisResult.skills && analysisResult.skills.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-indigo-600" />
                    Skills Detected in Your CV
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-semibold border border-indigo-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Jobs Section */}
              {matchedJobs.length > 0 && (
                <div id="matched-jobs" className="mt-8 pt-8 border-t-4 border-indigo-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Target className="w-8 h-8 text-indigo-600" />
                    Your Top {matchedJobs.length} Matched Jobs
                  </h3>
                  
                  <div className="space-y-4">
                    {matchedJobs.map((job, index) => (
                      <div 
                        key={index}
                        className="bg-white border-2 border-indigo-100 rounded-xl p-6 hover:shadow-lg transition-all hover:border-indigo-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-bold text-gray-800">{job.title}</h4>
                              {job.matchScore && (
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  job.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                                  job.matchScore >= 60 ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {job.matchScore}% Match
                                </span>
                              )}
                            </div>
                            
                            <p className="text-indigo-600 font-semibold mb-2">{job.company}</p>
                            
                            {job.location && (
                              <p className="text-sm text-gray-600 mb-2">📍 {job.location}</p>
                            )}
                            
                            {job.description && (
                              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                                {job.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                              {job.salary && (
                                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">
                                  💰 {job.salary}
                                </span>
                              )}
                              {job.created && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                  📅 {job.created}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <a
                            href={job.redirect_url || job.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all whitespace-nowrap flex items-center gap-2"
                          >
                            Apply Now
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* CV Editor Modal */}
        {showEditor && cvDataForEdit && (
          <CVEditor
            cvData={cvDataForEdit}
            analysisData={analysisResult}
            onClose={() => setShowEditor(false)}
          />
        )}

        {/* Info Cards */}
        {!analysisResult && !uploading && !analyzing && (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">Perfect Matches</h4>
              <p className="text-xs text-gray-600">AI finds jobs that match your exact skills and experience</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">✨</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">CV Tips</h4>
              <p className="text-xs text-gray-600">Get personalized suggestions to improve your CV</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">Instant Results</h4>
              <p className="text-xs text-gray-600">Analysis and matching completed in seconds</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

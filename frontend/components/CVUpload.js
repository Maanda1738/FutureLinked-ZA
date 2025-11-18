import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';

export default function CVUpload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    await processFile(file);
  };

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

  const processFile = async (file) => {
    if (!file) return;

    setFileName(file.name);

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

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('cv', file);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(true);
      
      // Store CV data in localStorage for matching
      localStorage.setItem('cvData', JSON.stringify(data.data));
      
      if (onUploadSuccess) {
        onUploadSuccess(data.data);
      }

    } catch (err) {
      setError(err.message || 'Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFileName('');
    setSuccess(false);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              AI CV Match Score
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </h3>
            <p className="text-sm text-gray-600">
              Get instant match scores for every job
            </p>
          </div>
        </div>
        {success && fileName && (
          <button
            onClick={clearFile}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Remove CV"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
          </button>
        )}
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : success 
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="cv-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          disabled={uploading || success}
          className="hidden"
        />
        
        <label
          htmlFor="cv-upload"
          className={`flex flex-col items-center ${!success && 'cursor-pointer'}`}
        >
          {uploading ? (
            <>
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
                </div>
              </div>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : success ? (
            <>
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-green-600 mb-3 animate-bounce" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </div>
              </div>
              <span className="text-lg font-bold text-green-700 mb-2">
                ✨ {fileName}
              </span>
            </>
          ) : error ? (
            <AlertCircle className="w-16 h-16 text-red-600 mb-3" />
          ) : (
            <>
              <Upload className="w-16 h-16 text-blue-500 mb-3 transition-transform group-hover:scale-110" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
            </>
          )}

          <span className="text-gray-800 font-semibold mb-2 text-lg">
            {uploading 
              ? 'Analyzing your CV...' 
              : success 
              ? 'CV Uploaded Successfully!' 
              : dragActive
              ? 'Drop your CV here!'
              : 'Drop your CV or click to browse'
            }
          </span>
          
          {!uploading && !success && (
            <span className="text-sm text-gray-500">
              📄 PDF, DOC, or DOCX • Max 5MB
            </span>
          )}
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-shake">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Upload Failed</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-semibold text-green-800 flex items-center gap-2">
                🎯 CV Analyzed Successfully!
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-600 text-white">
                  ACTIVE
                </span>
              </p>
              <p className="text-sm text-green-700 mt-1">
                Match scores are now showing on all jobs below! Look for the colored badges.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-sm font-bold text-green-600">Skills</div>
              <div className="text-xs text-gray-600">Analyzed</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-sm font-bold text-blue-600">Keywords</div>
              <div className="text-xs text-gray-600">Extracted</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-sm font-bold text-purple-600">Experience</div>
              <div className="text-xs text-gray-600">Mapped</div>
            </div>
          </div>
        </div>
      )}

      {!success && !uploading && (
        <div className="mt-4 flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
          <p>
            <span className="font-semibold text-blue-700">AI-Powered Matching:</span> We analyze your CV locally and securely. 
            Get instant match scores for every job and apply only to the best fits!
          </p>
        </div>
      )}
    </div>
  );
}

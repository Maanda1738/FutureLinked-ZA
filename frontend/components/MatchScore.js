import { Target, TrendingUp, Award, Zap, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function MatchScore({ score, breakdown, recommendation, cvData, jobTitle }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // Check if job matches desired roles from CV
  const roleMatch = checkRoleMatch(cvData, jobTitle);
  
  if (!score && score !== 0) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-600';
    if (score >= 60) return 'from-blue-400 to-indigo-600';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-blue-700';
    if (score >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getScoreEmoji = (score) => {
    if (score >= 80) return '🔥';
    if (score >= 60) return '✨';
    if (score >= 40) return '👍';
    return '💡';
  };

  return (
    <div className={`border-2 rounded-xl p-4 ${getScoreBg(score)} backdrop-blur-sm transition-all hover:shadow-lg`}>
      {/* Role Match Indicator (only show if matches) */}
      {roleMatch.hasRoles && roleMatch.matches && (
        <div className="mb-3 p-2 rounded-lg flex items-center gap-2 bg-green-100 border border-green-300">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            🎯 Matches Your Target Role
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 bg-gradient-to-br ${getScoreColor(score)} rounded-lg`}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className={`font-bold text-sm ${getScoreText(score)}`}>
            {roleMatch.hasRoles ? 'Skills Match' : 'AI Match Score'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-black ${getScoreText(score)}`}>{score}%</span>
          <span className="text-2xl">{getScoreEmoji(score)}</span>
        </div>
      </div>

      {/* Animated Progress bar */}
      <div className="w-full bg-white/50 rounded-full h-3 mb-3 overflow-hidden shadow-inner">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${score}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="flex items-start gap-2 mb-3">
          <Award className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getScoreText(score)}`} />
          <div>
            <div className={`font-bold text-sm ${getScoreText(score)}`}>
              {recommendation.level}
            </div>
            <div className={`text-sm ${getScoreText(score)} opacity-90`}>
              {recommendation.message}
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Toggle */}
      {breakdown && (
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
            showBreakdown ? 'bg-white/70' : 'bg-white/40 hover:bg-white/60'
          }`}
        >
          <span className={`text-sm font-semibold ${getScoreText(score)} flex items-center gap-1`}>
            <TrendingUp className="w-4 h-4" />
            Detailed Breakdown
          </span>
          {showBreakdown ? (
            <ChevronUp className={`w-4 h-4 ${getScoreText(score)}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${getScoreText(score)}`} />
          )}
        </button>
      )}

      {/* Breakdown Details */}
      {showBreakdown && breakdown && (
        <div className="mt-3 space-y-2 animate-fadeIn">
          {breakdown.skills !== undefined && (
            <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-gray-700">Skills Match</span>
              </div>
              <span className={`text-sm font-bold ${getScoreText(breakdown.skills)}`}>
                {Math.round(breakdown.skills)}%
              </span>
            </div>
          )}
          {breakdown.keywords !== undefined && (
            <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-gray-700">Keywords Match</span>
              </div>
              <span className={`text-sm font-bold ${getScoreText(breakdown.keywords)}`}>
                {Math.round(breakdown.keywords)}%
              </span>
            </div>
          )}
          {breakdown.experience !== undefined && (
            <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm font-medium text-gray-700">Experience Match</span>
              </div>
              <span className={`text-sm font-bold ${getScoreText(breakdown.experience)}`}>
                {Math.round(breakdown.experience)}%
              </span>
            </div>
          )}
          {breakdown.education !== undefined && (
            <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-700">Education Match</span>
              </div>
              <span className={`text-sm font-bold ${getScoreText(breakdown.education)}`}>
                {Math.round(breakdown.education)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to check if job title matches CV desired roles
function checkRoleMatch(cvData, jobTitle) {
  if (!cvData?.desiredRoles || cvData.desiredRoles.length === 0) {
    return { hasRoles: false, matches: false };
  }

  const jobTitleLower = (jobTitle || '').toLowerCase();
  
  const matches = cvData.desiredRoles.some(role => {
    const roleLower = role.toLowerCase();
    // Direct match
    if (jobTitleLower.includes(roleLower)) return true;
    
    // Fuzzy match (70% word overlap)
    const roleWords = roleLower.split(/\s+/).filter(w => w.length > 3);
    if (roleWords.length === 0) return jobTitleLower.includes(roleLower);
    
    const matchCount = roleWords.filter(word => jobTitleLower.includes(word)).length;
    return matchCount >= Math.ceil(roleWords.length * 0.7);
  });

  return { hasRoles: true, matches };
}

import { BarChart2, Check, X } from 'lucide-react';

export default function SuccessRateIndicator({ job, cvData }) {
  // Calculate match score based on various factors
  const calculateMatchScore = () => {
    if (!cvData) return 0;

    let score = 0;
    const maxScore = 100;

    // Skills match (40 points)
    if (cvData.skills && job.skills) {
      const userSkills = cvData.skills.map(s => s.toLowerCase());
      const jobSkills = job.skills.map(s => s.toLowerCase());
      const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(js => js.includes(skill) || skill.includes(js))
      );
      score += (matchingSkills.length / jobSkills.length) * 40;
    }

    // Experience match (30 points)
    if (cvData.experience && job.experienceRequired) {
      const userYears = cvData.experience.length || 0;
      const requiredYears = parseInt(job.experienceRequired) || 2;
      if (userYears >= requiredYears) {
        score += 30;
      } else {
        score += (userYears / requiredYears) * 30;
      }
    } else {
      score += 20; // Default partial score if no experience data
    }

    // Education match (20 points)
    if (cvData.education && job.educationRequired) {
      const hasRequiredEducation = cvData.education.some(edu => 
        edu.degree?.toLowerCase().includes(job.educationRequired.toLowerCase())
      );
      score += hasRequiredEducation ? 20 : 10;
    } else {
      score += 15; // Default partial score
    }

    // Location match (10 points)
    if (cvData.location && job.location) {
      const sameLocation = cvData.location.toLowerCase().includes(job.location.toLowerCase()) ||
                          job.location.toLowerCase().includes(cvData.location.toLowerCase());
      score += sameLocation ? 10 : 5;
    } else {
      score += 5;
    }

    return Math.min(Math.round(score), maxScore);
  };

  const matchScore = calculateMatchScore();

  const getScoreColor = () => {
    if (matchScore >= 80) return 'from-green-500 to-emerald-500';
    if (matchScore >= 60) return 'from-blue-500 to-cyan-500';
    if (matchScore >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreLabel = () => {
    if (matchScore >= 80) return 'Excellent Match';
    if (matchScore >= 60) return 'Good Match';
    if (matchScore >= 40) return 'Fair Match';
    return 'Low Match';
  };

  const getMatchFactors = () => {
    const factors = [];

    if (cvData?.skills && job.skills) {
      const userSkills = cvData.skills.map(s => s.toLowerCase());
      const jobSkills = job.skills.map(s => s.toLowerCase());
      const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(js => js.includes(skill) || skill.includes(js))
      );
      factors.push({
        label: 'Skills Match',
        match: matchingSkills.length > 0,
        detail: `${matchingSkills.length}/${jobSkills.length} skills`
      });
    }

    if (cvData?.experience) {
      factors.push({
        label: 'Experience',
        match: cvData.experience.length >= 2,
        detail: `${cvData.experience.length} years`
      });
    }

    if (cvData?.education) {
      factors.push({
        label: 'Education',
        match: cvData.education.length > 0,
        detail: cvData.education[0]?.degree || 'Qualified'
      });
    }

    if (cvData?.location && job.location) {
      const sameLocation = cvData.location.toLowerCase().includes(job.location.toLowerCase());
      factors.push({
        label: 'Location',
        match: sameLocation,
        detail: sameLocation ? 'Same area' : 'Different area'
      });
    }

    return factors;
  };

  if (!cvData) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Upload your CV to see match score
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
      {/* Match Score Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Match Score
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on your CV
            </p>
          </div>
        </div>

        <div className={`bg-gradient-to-r ${getScoreColor()} text-white px-6 py-3 rounded-2xl`}>
          <div className="text-3xl font-black">{matchScore}%</div>
          <div className="text-xs font-semibold">{getScoreLabel()}</div>
        </div>
      </div>

      {/* Match Factors */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Match Breakdown:
        </h4>
        {getMatchFactors().map((factor, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between bg-white dark:bg-gray-600 rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                factor.match ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {factor.match ? (
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-white text-sm">
                  {factor.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {factor.detail}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className={`mt-6 p-4 rounded-lg ${
        matchScore >= 60 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
          : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
      }`}>
        <p className={`text-sm font-medium ${
          matchScore >= 60 ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'
        }`}>
          {matchScore >= 60 
            ? '✨ Great fit! You should definitely apply for this position.' 
            : '💡 Consider highlighting relevant transferable skills in your application.'}
        </p>
      </div>
    </div>
  );
}

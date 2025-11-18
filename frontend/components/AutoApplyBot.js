import { useState, useEffect } from 'react';
import { Zap, Settings, Play, Pause, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function AutoApplyBot({ cvData, jobs }) {
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [liveStatus, setLiveStatus] = useState({ queue: [], processed: 0, successful: 0, failed: 0, isPaused: false });
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    todayApplications: 0,
    successRate: 0,
  });

  const [preferences, setPreferences] = useState({
    minMatchScore: 70,
    locations: [],
    jobTypes: ['full-time'],
    excludeCompanies: [],
    maxApplicationsPerDay: 10,
  });

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('autoApplyConfig');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      setIsActive(parsed.status === 'active');
      setPreferences(parsed.preferences);
    }

    // Load statistics
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const today = new Date().toDateString();
    const todayApplications = applications.filter(
      app => new Date(app.appliedAt).toDateString() === today
    );

    setStatistics({
      totalApplications: applications.length,
      todayApplications: todayApplications.length,
      successRate: applications.length > 0 
        ? Math.round((applications.filter(a => a.status === 'applied').length / applications.length) * 100)
        : 0,
    });
  };

  const handleActivate = async () => {
    if (!cvData) {
      alert('Please upload your CV first!');
      return;
    }

    const newConfig = {
      id: `auto-apply-${Date.now()}`,
      status: 'active',
      preferences,
      cvData,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/auto-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, cvData }),
      });

      const data = await response.json();

      if (data.success) {
        setConfig(data.config);
        setIsActive(true);
        localStorage.setItem('autoApplyConfig', JSON.stringify(data.config));
        
        // Start applying to jobs
        startAutoApply(data.config);
      }
    } catch (error) {
      console.error('Failed to activate auto-apply:', error);
      alert('Failed to activate auto-apply bot. Please try again.');
    }
  };

  const handleDeactivate = async () => {
    if (!config) return;

    try {
      const response = await fetch(`/api/auto-apply?configId=${config.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setIsActive(false);
        const updatedConfig = { ...config, status: 'inactive' };
        setConfig(updatedConfig);
        localStorage.setItem('autoApplyConfig', JSON.stringify(updatedConfig));
        // Stop engine if running
        try {
          const { getAutoApplyEngine } = await import('../utils/autoApplyEngine');
          const engine = getAutoApplyEngine(updatedConfig);
          engine.stop();
        } catch (e) {
          console.warn('Could not stop engine:', e);
        }
      }
    } catch (error) {
      console.error('Failed to deactivate auto-apply:', error);
    }
  };

  const startAutoApply = async (config) => {
    // Import the auto-apply engine
    const { getAutoApplyEngine } = await import('../utils/autoApplyEngine');
    const engine = getAutoApplyEngine(config);

    // Subscribe to live progress
    engine.onProgress((status) => {
      setLiveStatus(status || {});
      // refresh summary statistics from persisted applications
      loadStatistics();
      setIsPaused(!!status.isPaused);
    });

    // Start processing jobs (await but UI will update via onProgress)
    try {
      const results = await engine.start(jobs || []);
      // Update statistics
      loadStatistics();
      alert(`Auto-apply completed! Applied to ${results.successful} jobs.`);
      setIsActive(false);
      const updatedConfig = { ...config, status: 'inactive' };
      setConfig(updatedConfig);
      localStorage.setItem('autoApplyConfig', JSON.stringify(updatedConfig));
    } catch (e) {
      console.error('Auto-apply engine error', e);
    }
  };

  const handlePauseResume = async () => {
    if (!config) return;
    const { getAutoApplyEngine } = await import('../utils/autoApplyEngine');
    const engine = getAutoApplyEngine(config);
    if (isPaused) {
      engine.resume();
      setIsPaused(false);
    } else {
      engine.pause();
      setIsPaused(true);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 mb-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Auto-Apply Bot
            </h3>
            <p className="text-sm text-gray-600">
              {isActive ? 'Active - Auto-applying to matching jobs' : 'Inactive - Click to start'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Statistics */}
  <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-600">
            {statistics.totalApplications}
          </div>
          <div className="text-xs text-gray-600">Total Applications</div>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">
            {statistics.todayApplications}
          </div>
          <div className="text-xs text-gray-600">Today</div>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">
            {statistics.successRate}%
          </div>
          <div className="text-xs text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Auto-Apply Settings</h4>
          
          <div className="space-y-3">
            {/* Target Roles Display */}
            {cvData?.desiredRoles && cvData.desiredRoles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Target Job Roles (from your CV)
                </label>
                <div className="flex flex-wrap gap-2">
                  {cvData.desiredRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  The bot will only apply to jobs matching these roles. Upload a new CV to change.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Match Score: {preferences.minMatchScore}%
              </label>
              <input
                type="range"
                min="40"
                max="100"
                value={preferences.minMatchScore}
                onChange={(e) => setPreferences({
                  ...preferences,
                  minMatchScore: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                {cvData?.desiredRoles && cvData.desiredRoles.length > 0 
                  ? 'Fallback score if no role matches (not primary filter)'
                  : `Only apply to jobs matching ${preferences.minMatchScore}% or higher`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Applications Per Day
              </label>
              <select
                value={preferences.maxApplicationsPerDay}
                onChange={(e) => setPreferences({
                  ...preferences,
                  maxApplicationsPerDay: parseInt(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="5">5 applications</option>
                <option value="10">10 applications</option>
                <option value="20">20 applications</option>
                <option value="50">50 applications</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Types
              </label>
              <div className="flex flex-wrap gap-2">
                {['full-time', 'part-time', 'contract', 'temporary'].map(type => (
                  <label key={type} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.jobTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences({
                            ...preferences,
                            jobTypes: [...preferences.jobTypes, type]
                          });
                        } else {
                          setPreferences({
                            ...preferences,
                            jobTypes: preferences.jobTypes.filter(t => t !== type)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isActive ? (
          <button
            onClick={handleActivate}
            disabled={!cvData}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Activate Auto-Apply
          </button>
        ) : (
          <button
            onClick={handleDeactivate}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <Pause className="w-5 h-5" />
            Deactivate Bot
          </button>
        )}
        {isActive && (
          <button
            onClick={handlePauseResume}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            {isPaused ? (
              <Play className="w-5 h-5" />
            ) : (
              <Pause className="w-5 h-5" />
            )}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>

      {!cvData && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Upload your CV above to enable auto-apply feature.
          </p>
        </div>
      )}

      {isActive && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <div className="font-medium">Bot is active!</div>
            <div>
              {cvData?.desiredRoles && cvData.desiredRoles.length > 0 
                ? `Applying to jobs matching your target roles: ${cvData.desiredRoles.slice(0, 3).join(', ')}${cvData.desiredRoles.length > 3 ? '...' : ''}`
                : `Automatically applying to jobs that match ${preferences.minMatchScore}% or higher.`}
            </div>
            <div className="text-xs text-gray-700 mt-2">Queue: {liveStatus.queue?.length || 0} · Processed: {liveStatus.processed || 0} · Successful: {liveStatus.successful || 0} · Failed: {liveStatus.failed || 0}</div>
            {liveStatus.latest && (
              <div className="text-xs text-gray-700 mt-1">Latest: {liveStatus.latest.job?.title} — {liveStatus.latest.status}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

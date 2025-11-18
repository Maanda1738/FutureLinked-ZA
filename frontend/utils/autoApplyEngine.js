// Auto-Apply Engine - processes job applications automatically

import { calculateMatchScore } from './cvMatcher';

export class AutoApplyEngine {
  constructor(config) {
    this.config = config;
    this.queue = [];
    this.isRunning = false;
    this.isPaused = false;
    this.applications = [];
    this.progressCallback = null; // function to call with status updates
    // allow injection of a submitter function for real integrations
    // default submitter will be used if none provided
    this.submitter = config?.submitter || null;
  }

  // Start the auto-apply process
  async start(jobs) {
    if (this.isRunning) {
      console.log('Auto-apply already running');
      return;
    }
    this.isRunning = true;
    this.isPaused = false;
    console.log('Starting auto-apply bot...');

    // Filter jobs based on preferences
    const eligibleJobs = this.filterEligibleJobs(jobs);
    console.log(`Found ${eligibleJobs.length} eligible jobs`);

    // Add to queue
    this.queue = eligibleJobs.map(job => ({
      job,
      status: 'pending',
      matchScore: null,
      appliedAt: null,
      error: null,
    }));

    // Persist queue so UI can recover after reload
    try { localStorage.setItem('autoApplyQueue', JSON.stringify(this.queue)); } catch (e) { /* ignore */ }

    // Emit initial progress
    this.emitProgress();

    // Process queue
    await this.processQueue();

    this.isRunning = false;
    console.log('Auto-apply bot finished');

  // final progress update
  this.emitProgress();

    return {
      total: this.queue.length,
      successful: this.applications.filter(a => a.status === 'success').length,
      failed: this.applications.filter(a => a.status === 'failed').length,
    };
  }

  // Filter jobs based on user preferences - Role-based matching
  filterEligibleJobs(jobs) {
    const { preferences, cvData } = this.config;
    const desiredRoles = cvData?.desiredRoles || [];
    
    console.log('🎯 Filtering jobs for roles:', desiredRoles);
    
    return jobs.filter(job => {
      const jobTitle = (job.title || '').toLowerCase();
      const jobDescription = (job.description || '').toLowerCase();
      
      // 1. PRIMARY FILTER: Check if job title matches desired roles
      let titleMatch = false;
      if (desiredRoles.length > 0) {
        titleMatch = desiredRoles.some(role => {
          const roleLower = role.toLowerCase();
          // Direct match
          if (jobTitle.includes(roleLower)) return true;
          // Fuzzy match: check if key words overlap
          const roleWords = roleLower.split(/\s+/).filter(w => w.length > 3);
          const titleMatchCount = roleWords.filter(word => jobTitle.includes(word)).length;
          return titleMatchCount >= Math.ceil(roleWords.length * 0.7); // 70% word overlap
        });
        
        // If no title match, check description as fallback (less strict)
        if (!titleMatch) {
          titleMatch = desiredRoles.some(role => {
            const roleLower = role.toLowerCase();
            return jobDescription.includes(roleLower);
          });
        }
        
        if (!titleMatch) {
          return false; // Job title doesn't match any desired roles
        }
      } else {
        // Fallback: if no roles extracted, use old score-based matching
        const matchScore = calculateMatchScore(this.config.cvData, {
          title: job.title || '',
          description: job.description || '',
        });

        if (!matchScore || matchScore.score < preferences.minMatchScore) {
          return false;
        }
      }

      // 2. Check location preference
      if (preferences.locations.length > 0) {
        const jobLocation = (job.location?.display_name || '').toLowerCase();
        const matchesLocation = preferences.locations.some(loc =>
          jobLocation.includes(loc.toLowerCase())
        );
        if (!matchesLocation) {
          return false;
        }
      }

      // 3. Check job type preference
      if (preferences.jobTypes.length > 0) {
        const jobType = (job.contract_type || 'full-time').toLowerCase();
        if (!preferences.jobTypes.includes(jobType)) {
          return false;
        }
      }

      // 4. Check excluded companies
      if (preferences.excludeCompanies.length > 0) {
        const company = (job.company?.display_name || '').toLowerCase();
        const isExcluded = preferences.excludeCompanies.some(exc =>
          company.includes(exc.toLowerCase())
        );
        if (isExcluded) {
          return false;
        }
      }

      return true; // Job matches all criteria
    });
  }

  // Process the application queue
  async processQueue() {
    const { maxApplicationsPerDay } = this.config.preferences;
    let processedToday = 0;
    for (const item of this.queue) {
      if (processedToday >= maxApplicationsPerDay) {
        console.log('Daily application limit reached');
        break;
      }
      // Respect pause
      while (this.isPaused) {
        await this.delay(500);
      }

      try {
        await this.applyToJob(item);
        processedToday++;

        // Add delay between applications (2-5 seconds)
        await this.delay(2000 + Math.random() * 3000);
      } catch (error) {
        console.error('Application failed:', error);
        item.status = 'failed';
        item.error = error.message;
      }

      this.applications.push(item);

      // Persist queue & applications after each item
      try { localStorage.setItem('autoApplyQueue', JSON.stringify(this.queue)); } catch (e) {}
      try { localStorage.setItem('applications', JSON.stringify(this.applications.map(a => ({ jobId: a.job.id, jobTitle: a.job.title, company: a.job.company?.display_name, matchScore: a.matchScore, appliedAt: a.appliedAt, status: a.status })))) } catch (e) {}

      // Emit progress update for UI
      this.emitProgress(item);
    }
  }

  // Apply to a single job
  async applyToJob(item) {
    const { job } = item;
    
    console.log(`Applying to: ${job.title} at ${job.company?.display_name}`);

    // Calculate match score
    const matchScore = calculateMatchScore(this.config.cvData, {
      title: job.title || '',
      description: job.description || '',
    });
    item.matchScore = matchScore.score;

    // Simulate application process
    // In production, this would:
    // 1. Navigate to job application page
    // 2. Fill out application form
    // 3. Upload CV
    // 4. Submit application
    
    const success = await this.submitApplication(job);

    if (success) {
      item.status = 'success';
      item.appliedAt = new Date().toISOString();
      
      // Store application in database/localStorage
      this.saveApplication(item);
    } else {
      throw new Error('Application submission failed');
    }
  }

  // Submit application to job platform
  async submitApplication(job) {
    // If a submitter function was provided, call it (allows real integrations)
    if (this.submitter && typeof this.submitter === 'function') {
      try {
        return await this.submitter(job, this.config);
      } catch (e) {
        console.error('Submitter error:', e);
        return false;
      }
    }

    // Default simulated behavior for demo
    await this.delay(1000);
    return Math.random() > 0.1;
  }

  // Allow runtime injection of a submitter function
  setSubmitter(fn) {
    if (typeof fn === 'function') this.submitter = fn;
  }

  // Save application to storage
  saveApplication(item) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications.push({
      jobId: item.job.id,
      jobTitle: item.job.title,
      company: item.job.company?.display_name,
      matchScore: item.matchScore,
      appliedAt: item.appliedAt,
      status: item.status === 'success' ? 'applied' : 'failed',
      redirect_url: item.job.redirect_url,
    });
    localStorage.setItem('applications', JSON.stringify(applications));
  }

  // Utility: delay execution
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Stop the auto-apply process
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    console.log('Auto-apply bot stopped');
    this.emitProgress();
  }

  // Pause processing
  pause() {
    if (!this.isRunning) return;
    this.isPaused = true;
    console.log('Auto-apply bot paused');
    this.emitProgress();
  }

  // Resume processing
  resume() {
    if (!this.isRunning) return;
    this.isPaused = false;
    console.log('Auto-apply bot resumed');
    this.emitProgress();
  }

  // Register a progress callback for UI updates
  onProgress(cb) {
    this.progressCallback = cb;
  }

  emitProgress(latestItem = null) {
    if (typeof this.progressCallback === 'function') {
      const status = this.getStatus();
      status.queue = this.queue;
      status.latest = latestItem;
      status.isPaused = this.isPaused;
      this.progressCallback(status);
    }
  }

  // Get current status
  getStatus() {
    return {
      isRunning: this.isRunning,
      queueLength: this.queue.length,
      processed: this.applications.length,
      successful: this.applications.filter(a => a.status === 'success').length,
      failed: this.applications.filter(a => a.status === 'failed').length,
    };
  }
}

// Export singleton instance
let engineInstance = null;

export function getAutoApplyEngine(config) {
  if (!engineInstance || engineInstance.config.id !== config.id) {
    engineInstance = new AutoApplyEngine(config);
  }
  return engineInstance;
}

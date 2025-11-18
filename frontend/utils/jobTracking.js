// Track recently viewed jobs
export function trackViewedJob(job) {
  if (typeof window === 'undefined') return;
  
  const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  
  // Remove if already exists to update timestamp
  const filtered = viewed.filter(j => j.id !== job.id);
  
  // Add to beginning with timestamp
  const updated = [{ ...job, viewedAt: new Date().toISOString() }, ...filtered];
  
  // Keep only last 20 jobs
  const trimmed = updated.slice(0, 20);
  
  localStorage.setItem('recentlyViewed', JSON.stringify(trimmed));
}

// Get recently viewed jobs
export function getRecentlyViewed() {
  if (typeof window === 'undefined') return [];
  
  const viewed = localStorage.getItem('recentlyViewed');
  return viewed ? JSON.parse(viewed) : [];
}

// Track job for recommendations
export function trackJobInteraction(job, type = 'view') {
  if (typeof window === 'undefined') return;
  
  const interactions = JSON.parse(localStorage.getItem('jobInteractions') || '{}');
  
  if (!interactions[job.id]) {
    interactions[job.id] = {
      job,
      views: 0,
      clicks: 0,
      shares: 0,
      lastInteraction: null
    };
  }
  
  if (type === 'view') interactions[job.id].views++;
  if (type === 'click') interactions[job.id].clicks++;
  if (type === 'share') interactions[job.id].shares++;
  
  interactions[job.id].lastInteraction = new Date().toISOString();
  
  localStorage.setItem('jobInteractions', JSON.stringify(interactions));
}

// Get job recommendations based on interactions
export function getRecommendedJobs(allJobs) {
  if (typeof window === 'undefined') return [];
  
  const interactions = JSON.parse(localStorage.getItem('jobInteractions') || '{}');
  const viewed = Object.values(interactions);
  
  if (viewed.length === 0) return allJobs.slice(0, 6);
  
  // Extract keywords from viewed jobs
  const keywords = new Set();
  viewed.forEach(item => {
    const job = item.job;
    if (job.title) {
      job.title.toLowerCase().split(' ').forEach(word => keywords.add(word));
    }
    if (job.category) keywords.add(job.category.toLowerCase());
    if (job.location) keywords.add(job.location.toLowerCase());
  });
  
  // Score jobs based on keyword matches
  const scored = allJobs.map(job => {
    let score = 0;
    const jobText = `${job.title} ${job.category} ${job.location}`.toLowerCase();
    
    keywords.forEach(keyword => {
      if (jobText.includes(keyword)) score++;
    });
    
    return { job, score };
  });
  
  // Return top matches
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.job)
    .slice(0, 6);
}

// Compare jobs
export function addToComparison(job) {
  if (typeof window === 'undefined') return;
  
  const comparison = JSON.parse(localStorage.getItem('jobComparison') || '[]');
  
  if (comparison.length >= 3) {
    alert('You can compare up to 3 jobs at a time. Remove one to add another.');
    return false;
  }
  
  if (comparison.some(j => j.id === job.id)) {
    return false;
  }
  
  comparison.push(job);
  localStorage.setItem('jobComparison', JSON.stringify(comparison));
  return true;
}

export function removeFromComparison(jobId) {
  if (typeof window === 'undefined') return;
  
  const comparison = JSON.parse(localStorage.getItem('jobComparison') || '[]');
  const updated = comparison.filter(j => j.id !== jobId);
  localStorage.setItem('jobComparison', JSON.stringify(updated));
}

export function getComparisonJobs() {
  if (typeof window === 'undefined') return [];
  
  const comparison = localStorage.getItem('jobComparison');
  return comparison ? JSON.parse(comparison) : [];
}

export function clearComparison() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jobComparison');
}

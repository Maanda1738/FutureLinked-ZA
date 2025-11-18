// Simple harness to test autoApplyEngine in Node.js (mocks localStorage)
import path from 'path';
import { fileURLToPath } from 'url';

// Minimal localStorage mock for Node
global.localStorage = (() => {
  let store = {};
  return {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = String(value); },
    removeItem(key) { delete store[key]; },
    clear() { store = {}; }
  };
})();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import engine
const engineModule = await import(path.resolve(__dirname, '..', 'frontend', 'utils', 'autoApplyEngine.js'));
const { getAutoApplyEngine } = engineModule;

(async () => {
  const fakeConfig = {
    id: `auto-apply-test-${Date.now()}`,
    preferences: { minMatchScore: 0, maxApplicationsPerDay: 10 },
    cvData: { skills: ['javascript', 'react'], keywords: ['react'], experience: { years: 3 }, education: [] }
  };

  const jobs = [
    { id: '1', title: 'React Developer', description: 'Frontend work with react and javascript', company: { display_name: 'Company A' }, redirect_url: 'https://example.com/1' },
    { id: '2', title: 'Node Engineer', description: 'Back-end with nodejs', company: { display_name: 'Company B' }, redirect_url: 'https://example.com/2' },
    { id: '3', title: 'Senior React', description: 'Senior react developer required', company: { display_name: 'Company C' }, redirect_url: 'https://example.com/3' }
  ];

  const engine = getAutoApplyEngine(fakeConfig);

  // Attach a submitter that always succeeds quickly
  engine.setSubmitter(async (job) => {
    console.log(`[submitter] submitting to ${job.title} at ${job.company?.display_name}`);
    await new Promise(r => setTimeout(r, 200));
    return true;
  });

  engine.onProgress((status) => {
    console.log('[progress]', status.queue?.length, 'in queue - processed', status.processed, 'successful', status.successful);
  });

  // Start the engine but pause after first job
  setTimeout(() => {
    console.log('[test] pausing engine');
    engine.pause();
  }, 700);

  setTimeout(() => {
    console.log('[test] resuming engine');
    engine.resume();
  }, 2000);

  const results = await engine.start(jobs);
  console.log('[test] finished:', results);
  console.log('[test] persisted applications:', localStorage.getItem('applications'));
})();
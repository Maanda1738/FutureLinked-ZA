// Auto-Apply Bot API - manages automatic job applications

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'frontend', 'data', 'autoApplyConfigs.json');

function readConfigs() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Failed to read configs', e);
    return [];
  }
}

function writeConfigs(configs) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(configs, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write configs', e);
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleStartAutoApply(req, res);
  } else if (req.method === 'GET') {
    return handleGetStatus(req, res);
  } else if (req.method === 'DELETE') {
    return handleStopAutoApply(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleStartAutoApply(req, res) {
  const { preferences, cvData } = req.body;

  if (!preferences || !cvData) {
    return res.status(400).json({ 
      error: 'Missing required fields: preferences and cvData' 
    });
  }

  // Validate preferences
  if (!preferences.minMatchScore || preferences.minMatchScore < 0 || preferences.minMatchScore > 100) {
    return res.status(400).json({ 
      error: 'minMatchScore must be between 0 and 100' 
    });
  }

  // Create auto-apply configuration
  const config = {
    id: generateId(),
    userId: req.headers['user-id'] || 'guest', // In production, use proper auth
    status: 'active',
    preferences: {
      minMatchScore: preferences.minMatchScore || 60,
      locations: preferences.locations || [],
      jobTypes: preferences.jobTypes || ['full-time'],
      excludeCompanies: preferences.excludeCompanies || [],
      maxApplicationsPerDay: preferences.maxApplicationsPerDay || 10,
      autoWithdrawAfterDays: preferences.autoWithdrawAfterDays || null,
    },
    cvData,
    statistics: {
      totalApplications: 0,
      pendingApplications: 0,
      successfulApplications: 0,
      failedApplications: 0,
      startDate: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  };

  // Persist config to disk for demo
  const configs = readConfigs();
  configs.push(config);
  writeConfigs(configs);

  return res.status(200).json({
    success: true,
    message: 'Auto-apply bot activated',
    config,
  });
}

async function handleGetStatus(req, res) {
  const { configId } = req.query;

  const configs = readConfigs();

  if (!configId) {
    // return all configs
    return res.status(200).json({ success: true, configs });
  }

  const cfg = configs.find(c => c.id === configId);
  if (!cfg) return res.status(404).json({ success: false, error: 'Config not found' });

  // Return stored config and a lightweight status
  const status = {
    id: cfg.id,
    status: cfg.status,
    statistics: cfg.statistics || {},
    lastRunAt: new Date().toISOString(),
  };

  return res.status(200).json({ success: true, status });
}

async function handleStopAutoApply(req, res) {
  const { configId } = req.query;

  if (!configId) {
    return res.status(400).json({ error: 'Missing configId' });
  }

  const configs = readConfigs();
  const idx = configs.findIndex(c => c.id === configId);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Config not found' });

  configs[idx].status = 'inactive';
  writeConfigs(configs);

  return res.status(200).json({
    success: true,
    message: 'Auto-apply bot deactivated',
    config: configs[idx],
  });
}

function generateId() {
  return `auto-apply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

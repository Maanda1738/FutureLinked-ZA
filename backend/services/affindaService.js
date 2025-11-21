const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class AffindaService {
  constructor() {
    this.apiKey = process.env.AFFINDA_API_KEY;
    this.region = process.env.AFFINDA_REGION || 'api';
    this.workspaceId = process.env.AFFINDA_WORKSPACE_ID;
    this.baseUrl = `https://${this.region}.affinda.com`;
  }

  /**
   * Upload and parse a CV/Resume
   * @param {string} filePath - Path to the CV file
   * @param {object} options - Additional options
   * @returns {Promise<object>} Parsed CV data
   */
  async parseCV(filePath, options = {}) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      // Add workspace if configured
      if (this.workspaceId) {
        form.append('workspace', this.workspaceId);
      }
      
      // Wait for parsing to complete (synchronous)
      form.append('wait', 'true');
      
      // Delete file after parsing to save storage
      if (options.deleteAfterParse !== false) {
        form.append('deleteAfterParse', 'true');
      }
      
      // Compact response (just parsed values, not all metadata)
      if (options.compact) {
        form.append('compact', 'true');
      }

      const response = await axios.post(`${this.baseUrl}/v2/resumes`, form, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...form.getHeaders()
        },
        timeout: 30000 // 30 second timeout
      });

      return this.transformParsedData(response.data);
    } catch (error) {
      console.error('Affinda parsing error:', error.response?.data || error.message);
      throw new Error(`CV parsing failed: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Parse CV from buffer (useful for direct uploads)
   * @param {Buffer} buffer - File buffer
   * @param {string} filename - Original filename
   * @param {object} options - Additional options
   * @returns {Promise<object>} Parsed CV data
   */
  async parseCVFromBuffer(buffer, filename, options = {}) {
    try {
      const form = new FormData();
      form.append('file', buffer, { filename });
      
      if (this.workspaceId) {
        form.append('workspace', this.workspaceId);
      }
      
      form.append('wait', 'true');
      
      if (options.deleteAfterParse !== false) {
        form.append('deleteAfterParse', 'true');
      }
      
      if (options.compact) {
        form.append('compact', 'true');
      }

      const response = await axios.post(`${this.baseUrl}/v2/resumes`, form, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...form.getHeaders()
        },
        timeout: 30000
      });

      return this.transformParsedData(response.data);
    } catch (error) {
      console.error('Affinda parsing error:', error.response?.data || error.message);
      throw new Error(`CV parsing failed: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Get parsed resume by identifier
   * @param {string} identifier - Resume identifier from upload response
   * @returns {Promise<object>} Parsed resume data
   */
  async getParseResults(identifier) {
    try {
      const response = await axios.get(`${this.baseUrl}/v2/resumes/${identifier}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return this.transformParsedData(response.data);
    } catch (error) {
      console.error('Affinda fetch error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch parsed CV: ${error.message}`);
    }
  }

  /**
   * Search and match resumes against job description
   * @param {object} searchParams - Search parameters
   * @returns {Promise<array>} Matched candidates with scores
   */
  async searchResumes(searchParams) {
    try {
      const {
        jobDescription,
        jobTitles = [],
        yearsExperienceMin = 0,
        yearsExperienceMax = 50,
        locations = [],
        skills = [],
        indices = ['all-resumes']
      } = searchParams;

      const payload = {
        indices,
        jobDescription,
        jobTitles,
        yearsExperienceMin,
        yearsExperienceMax,
        locations: locations.map(loc => ({
          name: loc.name || loc,
          distance: loc.distance || 50,
          unit: loc.unit || 'km'
        })),
        skills
      };

      const response = await axios.post(`${this.baseUrl}/v3/resume_search`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Affinda search error:', error.response?.data || error.message);
      throw new Error(`Resume search failed: ${error.message}`);
    }
  }

  /**
   * Transform Affinda's parsed data to FutureLinked format
   * @param {object} affindaData - Raw data from Affinda
   * @returns {object} Transformed data
   */
  transformParsedData(affindaData) {
    const data = affindaData.data || affindaData;

    return {
      // Basic Info
      name: data.name?.raw || '',
      email: data.emails?.[0]?.value || '',
      phone: data.phoneNumbers?.[0]?.value || '',
      location: this.formatLocation(data.location),
      
      // Professional Summary
      summary: data.summary || data.objective || '',
      
      // Skills
      skills: this.extractSkills(data.skills),
      
      // Experience
      experience: this.formatExperience(data.workExperience),
      totalYearsExperience: this.calculateYearsExperience(data.workExperience),
      
      // Education
      education: this.formatEducation(data.education),
      
      // Additional Info
      certifications: data.certifications || [],
      languages: data.languages || [],
      websites: data.websites || [],
      
      // Desired Roles (extracted from job titles)
      desiredRoles: this.extractDesiredRoles(data),
      
      // Keywords for matching
      keywords: this.extractKeywords(data),
      
      // Raw data for reference
      raw: {
        affindaIdentifier: data.meta?.identifier,
        parsedAt: new Date().toISOString(),
        confidence: data.meta?.confidence
      }
    };
  }

  formatLocation(location) {
    if (!location) return '';
    
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);
    
    return parts.join(', ');
  }

  extractSkills(skills) {
    if (!skills || !Array.isArray(skills)) return [];
    
    return skills
      .map(skill => skill.name || skill.value || skill)
      .filter(Boolean)
      .slice(0, 50); // Limit to top 50 skills
  }

  formatExperience(workExperience) {
    if (!workExperience || !Array.isArray(workExperience)) return [];
    
    return workExperience.map(job => ({
      title: job.jobTitle || job.title || '',
      company: job.organization || job.company || '',
      location: job.location?.raw || '',
      startDate: job.dates?.startDate || '',
      endDate: job.dates?.endDate || 'Present',
      duration: this.calculateDuration(job.dates),
      description: job.jobDescription || job.description || '',
      responsibilities: job.responsibilities || []
    }));
  }

  formatEducation(education) {
    if (!education || !Array.isArray(education)) return [];
    
    return education.map(edu => ({
      degree: edu.accreditation?.education || edu.degree || '',
      field: edu.accreditation?.educationLevel || edu.field || '',
      institution: edu.organization || edu.institution || '',
      location: edu.location?.raw || '',
      startDate: edu.dates?.startDate || '',
      endDate: edu.dates?.completionDate || edu.dates?.endDate || '',
      gpa: edu.grade || ''
    }));
  }

  calculateYearsExperience(workExperience) {
    if (!workExperience || !Array.isArray(workExperience)) return 0;
    
    let totalMonths = 0;
    
    workExperience.forEach(job => {
      if (job.dates?.startDate) {
        const start = new Date(job.dates.startDate);
        const end = job.dates?.endDate ? new Date(job.dates.endDate) : new Date();
        
        const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                       (end.getMonth() - start.getMonth());
        
        totalMonths += Math.max(0, months);
      }
    });
    
    return Math.round(totalMonths / 12 * 10) / 10; // Years with 1 decimal
  }

  calculateDuration(dates) {
    if (!dates?.startDate) return '';
    
    const start = new Date(dates.startDate);
    const end = dates?.endDate ? new Date(dates.endDate) : new Date();
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    const totalMonths = years * 12 + months;
    const finalYears = Math.floor(totalMonths / 12);
    const finalMonths = totalMonths % 12;
    
    const parts = [];
    if (finalYears > 0) parts.push(`${finalYears} year${finalYears > 1 ? 's' : ''}`);
    if (finalMonths > 0) parts.push(`${finalMonths} month${finalMonths > 1 ? 's' : ''}`);
    
    return parts.join(', ') || 'Less than 1 month';
  }

  extractDesiredRoles(data) {
    const roles = new Set();
    
    // From objective/summary
    if (data.objective) {
      const objectiveText = data.objective.toLowerCase();
      const patterns = ['seeking', 'looking for', 'interested in', 'applying for'];
      patterns.forEach(pattern => {
        if (objectiveText.includes(pattern)) {
          // Extract role mentioned after pattern
          const match = objectiveText.match(new RegExp(`${pattern}[:\\s]+([^.\\n]{10,100})`, 'i'));
          if (match) roles.add(match[1].trim());
        }
      });
    }
    
    // From work experience (most recent roles)
    if (data.workExperience && Array.isArray(data.workExperience)) {
      data.workExperience.slice(0, 3).forEach(job => {
        if (job.jobTitle) roles.add(job.jobTitle);
      });
    }
    
    return Array.from(roles);
  }

  extractKeywords(data) {
    const keywords = new Set();
    
    // From skills
    if (data.skills) {
      data.skills.forEach(skill => {
        const skillName = skill.name || skill.value || skill;
        if (skillName) keywords.add(skillName.toLowerCase());
      });
    }
    
    // From job titles
    if (data.workExperience) {
      data.workExperience.forEach(job => {
        if (job.jobTitle) {
          job.jobTitle.split(/\s+/).forEach(word => {
            if (word.length > 3) keywords.add(word.toLowerCase());
          });
        }
      });
    }
    
    // From summary
    if (data.summary) {
      const words = data.summary.split(/\s+/);
      words.forEach(word => {
        const cleaned = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (cleaned.length > 4) keywords.add(cleaned);
      });
    }
    
    return Array.from(keywords).slice(0, 100);
  }
}

module.exports = new AffindaService();

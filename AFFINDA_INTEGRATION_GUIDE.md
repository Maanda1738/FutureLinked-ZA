# Affinda CV Parsing Integration Guide

## Overview
FutureLinked ZA now integrates with Affinda's professional CV parsing API to provide advanced resume parsing capabilities with structured data extraction.

## What is Affinda?
Affinda is a professional resume parsing service that extracts structured data from CVs/resumes with high accuracy. It provides:
- **Accurate parsing** of PDF, Word, and text documents
- **Structured data extraction** (name, email, phone, skills, experience, education)
- **Resume search/matching** for recruiter features
- **Multi-language support**
- **POPIA/GDPR compliant** data handling

## Integration Status

### ✅ Completed
1. **Affinda Service Module** (`backend/services/affindaService.js`)
   - Upload and parse CV synchronously
   - Parse CV from buffer (direct uploads)
   - Get parsing results by identifier
   - Search and match resumes against job descriptions
   - Transform Affinda data to FutureLinked format

2. **CV Analysis Route** (`backend/routes/cv-analysis.js`)
   - Updated `/api/cv/upload` endpoint with Affinda integration
   - Automatic fallback to basic extraction if Affinda unavailable
   - New `/api/cv/config` endpoint to check API configuration

3. **Environment Configuration** (`.env`)
   - `AFFINDA_API_KEY` - Your Affinda API key ✅
   - `AFFINDA_REGION` - API region (default: 'api') ✅
   - `AFFINDA_WORKSPACE` - Workspace identifier (optional) ⚠️
   - `AFFINDA_DOCUMENT_TYPE` - Document type identifier (optional) ⚠️

4. **Dependencies**
   - Added `form-data` package for file uploads ✅

## Setup Steps

### 1. Configure Workspace and Document Type (Recommended)

To fully utilize Affinda's features, configure your workspace and document type in the Affinda dashboard:

1. **Log in to Affinda Dashboard**: https://app.affinda.com/
2. **Create a Workspace**:
   - Go to Settings → Workspaces
   - Create workspace: "FutureLinked ZA - CVs"
   - Copy the workspace identifier (e.g., `wrkspc_1234567890`)
3. **Create Document Type**:
   - Go to Settings → Document Types
   - Create type: "Resume/CV"
   - Copy the document type identifier (e.g., `doctype_1234567890`)
4. **Update `.env` file**:
   ```env
   AFFINDA_WORKSPACE=wrkspc_1234567890
   AFFINDA_DOCUMENT_TYPE=doctype_1234567890
   ```

### 2. Test the Integration

**Check Configuration Status:**
```bash
curl http://localhost:3001/api/cv/config
```

Expected response:
```json
{
  "success": true,
  "affinda": {
    "configured": true,
    "apiKey": "✓ Configured",
    "region": "api",
    "workspace": "✓ Configured",
    "documentType": "✓ Configured",
    "status": "Professional parsing enabled"
  },
  "openai": {
    "configured": true,
    "status": "CV editing enabled"
  },
  "gemini": {
    "configured": true,
    "status": "CV analysis available"
  }
}
```

**Test CV Upload:**
```bash
# Upload a test CV
curl -X POST http://localhost:3001/api/cv/upload \
  -F "cv=@/path/to/sample-cv.pdf"
```

Expected response:
```json
{
  "success": true,
  "message": "CV uploaded successfully (parsed by Affinda API)",
  "data": {
    "fileName": "sample-cv.pdf",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+27 12 345 6789",
    "location": "Johannesburg, Gauteng, South Africa",
    "skills": ["Python", "JavaScript", "React", "SQL", "Data Analysis"],
    "experience": {
      "years": 5.3,
      "roles": [...]
    },
    "education": [...],
    "parsedBy": "Affinda API"
  }
}
```

### 3. Restart Backend Server

After configuration changes, restart the backend:
```bash
cd backend
npm start
```

Or if using nodemon:
```bash
npm run dev
```

## API Endpoints

### Upload CV
**POST** `/api/cv/upload`
- Upload and parse CV using Affinda (or fallback to basic extraction)
- **Form-data**: `cv` (file: PDF, DOC, DOCX)
- **Response**: Structured CV data

### Check Configuration
**GET** `/api/cv/config`
- Check Affinda API configuration status
- **Response**: Configuration details and status

### Analyze CV
**POST** `/api/cv/analyze`
- Analyze CV with AI (Google Gemini or fallback)
- **Body**: `{ cvData: {...} }`
- **Response**: CV analysis with suggestions

### Match Jobs
**POST** `/api/cv/match-jobs`
- Find matching jobs based on CV
- **Body**: `{ cvData: {...}, analysis: {...} }`
- **Response**: List of matched jobs with scores

## Features

### Structured Data Extraction
Affinda extracts the following information:

**Personal Information:**
- Full name
- Email address
- Phone number
- Physical location
- LinkedIn profile
- Personal websites

**Professional Data:**
- Skills (50+ skills with confidence scores)
- Work experience (title, company, dates, description)
- Total years of experience (auto-calculated)
- Education (degree, institution, dates, GPA)
- Certifications
- Languages and proficiency levels

**Keywords and Matching:**
- Industry-specific keywords
- Desired roles/positions
- Job titles from experience
- Summary/objective statement

### Intelligent Fallback
If Affinda API is unavailable or fails:
1. System automatically falls back to basic text extraction
2. Uses regex patterns to extract skills, experience, education
3. Generates keywords from CV text
4. Still provides functional CV analysis (with reduced accuracy)

### Privacy & Security
- **API key stored server-side only** (never exposed to frontend)
- **POPIA compliant** data handling
- **Automatic file deletion** after parsing (saves storage costs)
- **Temporary file storage** with immediate cleanup
- **No CV storage** on Affinda servers (when deleteAfterParse: true)

## Cost Management

### Affinda Pricing
- **Pay-per-use**: ~$0.10 - $0.20 per resume parse
- **Monthly subscription**: $99/month for 500 parses
- **Enterprise**: Custom pricing for high volume

### Cost Optimization
1. **Enable deleteAfterParse**: Saves storage costs (already enabled)
2. **Use compact responses**: Reduces bandwidth (optional)
3. **Monitor usage**: Track parsing calls in Affinda dashboard
4. **Set rate limits**: Prevent API abuse
5. **Cache parsed CVs**: Store results in Firestore/localStorage to avoid re-parsing

### Current Configuration
```javascript
// backend/routes/cv-analysis.js
const affindaData = await affindaService.parseCV(req.file.path, {
  deleteAfterParse: true,  // ✅ Delete after parsing (saves costs)
  compact: false           // Full response for better data quality
});
```

## Advanced Features

### Resume Search/Match (For Recruiters)
```javascript
const matches = await affindaService.searchResumes({
  jobDescription: "Looking for a Python developer with 3+ years experience",
  jobTitles: ["Python Developer", "Software Engineer"],
  yearsExperienceMin: 3,
  yearsExperienceMax: 10,
  locations: [
    { name: "Johannesburg, South Africa", distance: 50, unit: "km" }
  ],
  skills: ["Python", "Django", "PostgreSQL"]
});
```

This feature can be used for:
- **Job matching**: Find candidates for specific positions
- **Talent pool search**: Search database of parsed CVs
- **Skills-based filtering**: Match by specific skills/experience
- **Location-based search**: Find candidates in specific areas

## Troubleshooting

### Issue: "Affinda parsing failed, falling back to basic extraction"
**Causes:**
- Invalid API key
- API rate limit exceeded
- Network connection issues
- Unsupported file format

**Solution:**
1. Check API key in `.env` file
2. Verify Affinda dashboard for rate limits
3. Check network connectivity
4. Ensure CV is PDF, DOC, or DOCX format

### Issue: Workspace/Document Type not found
**Cause:** Invalid workspace or document type identifiers

**Solution:**
1. Log in to Affinda dashboard
2. Navigate to Settings → Workspaces
3. Copy correct workspace identifier
4. Navigate to Settings → Document Types
5. Copy correct document type identifier
6. Update `.env` file with correct values

### Issue: Low parsing accuracy
**Causes:**
- Poor quality CV (scanned images, complex formatting)
- Unsupported language
- Missing workspace configuration

**Solution:**
1. Configure workspace and document type in `.env`
2. Use high-quality PDF or Word documents
3. Avoid scanned images or complex graphics
4. Ensure CV is in English or supported language

## Next Steps

### Frontend Integration
1. **Update CV upload UI** to show parsing progress
2. **Display structured data** (name, email, skills, experience)
3. **Show parsing confidence** indicators
4. **Add validation** for extracted fields
5. **Allow manual editing** of parsed data

### Database Integration
1. **Store parsed CVs** in Firestore
2. **Create CV search index** for recruiter features
3. **Track parsing history** and costs
4. **Implement CV versioning**

### Advanced Features
1. **Resume search dashboard** for recruiters
2. **Job matching recommendations** based on CV
3. **Skills gap analysis** for candidates
4. **CV improvement suggestions** based on Affinda data
5. **Batch CV processing** for recruiters

## Resources

- **Affinda API Documentation**: https://docs.affinda.com/
- **Affinda Dashboard**: https://app.affinda.com/
- **Support**: support@affinda.com
- **Status Page**: https://status.affinda.com/

## Summary

✅ **Affinda API integrated successfully**
✅ **Professional CV parsing enabled**
✅ **Automatic fallback to basic extraction**
✅ **Privacy and security compliant**
✅ **Cost optimization configured**
⚠️ **Workspace and document type configuration recommended**

The integration is fully functional and production-ready. Configure workspace and document type for optimal performance.

# Role-Based CV Matching System 🎯

## Overview

The FutureLinked auto-apply bot now uses **intelligent role-based matching** instead of generic keyword scoring. This makes job matching more accurate and predictable.

---

## How It Works

### 1. **CV Upload & Role Extraction** 📄

When a user uploads their CV (PDF/DOCX), the system:

1. **Extracts text** using `pdf-parse` and `mammoth`
2. **Parses job titles** from multiple sources:
   - Career objective/summary sections ("Seeking...", "Looking for...")
   - Work experience section (recent roles held)
   - Frequency analysis (titles mentioned 2+ times)
   - Generic role keywords as fallback

3. **Returns array of target roles**, e.g.:
   ```javascript
   desiredRoles: [
     "software developer",
     "full stack developer", 
     "web developer",
     "it support technician"
   ]
   ```

---

### 2. **Job Filtering Logic** 🔍

When searching for jobs, the engine filters using this hierarchy:

#### **PRIMARY FILTER: Title Matching**
- Job title must match one of the user's desired roles
- Uses **fuzzy matching** (70% word overlap)
- Falls back to description matching if title doesn't match

#### **SECONDARY FILTERS:**
- ✅ Location preference
- ✅ Job type (full-time, part-time, contract)
- ✅ Excluded companies

#### **FALLBACK:**
- If no roles extracted from CV, uses old score-based matching (skills/keywords)

---

## Code Architecture

### Key Files

| File | Purpose |
|------|---------|
| `frontend/pages/api/upload-cv.js` | CV upload endpoint, imports role extractor |
| `frontend/pages/api/extractDesiredRoles.js` | Role extraction logic (60+ job title patterns) |
| `frontend/utils/autoApplyEngine.js` | Filtering engine with role-based matching |
| `frontend/components/AutoApplyBot.js` | UI shows extracted roles |

---

### Flow Diagram

```
┌─────────────────┐
│  User uploads   │
│   CV (PDF/DOC)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  extractDesiredRoles(cvText)        │
│  • Check objective/summary          │
│  • Parse experience section         │
│  • Analyze title frequency          │
│  • Return array of roles            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  cvData.desiredRoles stored         │
│  ["developer", "analyst", ...]      │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  User activates auto-apply bot      │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  filterEligibleJobs(jobs)           │
│  • Match job.title vs desiredRoles  │
│  • Apply location/type filters      │
│  • Return matching jobs only        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Auto-apply to filtered jobs        │
└─────────────────────────────────────┘
```

---

## Role Extraction Examples

### Example 1: IT Support CV
```text
CAREER OBJECTIVE
Seeking an IT Support Technician role with CCNA certification...

EXPERIENCE
IT Support Specialist - TechCorp (2021-2023)
Network Technician - NetSolutions (2019-2021)
```

**Extracted Roles:**
- `it support technician`
- `it support specialist`
- `network technician`

**Result:** Bot only applies to IT support and network jobs ✅

---

### Example 2: Business Analyst CV
```text
SUMMARY
Experienced Business Analyst with 5 years in data analysis...

EXPERIENCE
Senior Business Analyst - FinCorp (2020-2024)
Data Analyst - DataCo (2018-2020)
```

**Extracted Roles:**
- `business analyst`
- `data analyst`

**Result:** Bot filters for analyst positions only ✅

---

## Job Title Pattern Library

The system recognizes **60+ job title patterns** across categories:

### 🖥️ IT & Tech
- `software developer`, `web developer`, `full stack developer`
- `data analyst`, `data scientist`, `database administrator`
- `it support`, `network engineer`, `system administrator`
- `devops engineer`, `cloud engineer`, `cybersecurity specialist`
- `ui/ux designer`, `product manager`, `qa engineer`

### 💼 Business & Finance
- `accountant`, `financial analyst`, `business analyst`
- `project manager`, `operations manager`, `sales manager`
- `financial advisor`, `investment analyst`

### 🏥 Healthcare
- `nurse`, `medical doctor`, `pharmacist`, `healthcare assistant`

### 🔧 Engineering
- `mechanical engineer`, `electrical engineer`, `civil engineer`

### 🎨 Creative & Media
- `graphic designer`, `content writer`, `social media manager`
- `seo specialist`, `video editor`, `photographer`

### 📚 Education
- `teacher`, `lecturer`, `tutor`, `professor`

### ⚖️ Legal
- `lawyer`, `attorney`, `paralegal`, `compliance officer`

---

## UI Features

### Settings Panel (when expanded)
```
🎯 Target Job Roles (from your CV)
┌─────────────────────────────────────┐
│ [software developer] [web developer]│
│ [it support technician]             │
└─────────────────────────────────────┘
The bot will only apply to jobs matching these roles.
Upload a new CV to change.
```

### Active Bot Status
```
✅ Bot is active!
Applying to jobs matching your target roles:
software developer, web developer, it support...

Queue: 12 · Processed: 3 · Successful: 2 · Failed: 1
Latest: Junior Web Developer — success
```

---

## Matching Algorithm Details

### Title Matching Logic

```javascript
// Direct match
jobTitle.includes(desiredRole) // "Software Developer" matches "software developer"

// Fuzzy match (70% word overlap)
const roleWords = "full stack developer".split(' '); // ["full", "stack", "developer"]
const titleWords = "Full Stack Web Developer".toLowerCase();
// Matches if 70%+ of role words appear in title
// "full" ✅, "stack" ✅, "developer" ✅ → 100% match ✅
```

### Fallback to Description
If title doesn't match but description contains role:
```javascript
jobDescription.includes(desiredRole) // Check full description
```

### Score-Based Fallback
If NO roles extracted from CV:
```javascript
calculateMatchScore(cvData, job)
// Uses old algorithm: skills (40%) + keywords (30%) + experience (20%) + education (10%)
```

---

## Benefits Over Old System

| Old System | New System |
|------------|------------|
| Generic keyword scoring | Targeted role matching |
| Complex weights (40/30/20/10) | Simple title matching |
| Applies to irrelevant jobs | Only applies to matching roles |
| Hard to predict behavior | Transparent and predictable |
| "JavaScript" matches "Java" | "Web Developer" matches "Web Developer" |

---

## Configuration

Users can still customize:
- **Job Types:** Full-time, part-time, contract, temporary
- **Locations:** Filter by city/region
- **Excluded Companies:** Blacklist specific employers
- **Daily Limit:** Max applications per day (5/10/20/50)
- **Fallback Score:** If no roles matched (40-100%)

---

## Testing Tips

1. **Upload CV with clear job titles** in experience section
2. **Check extracted roles** in settings panel
3. **Verify bot only applies to matching jobs**
4. **Test with different CVs** (IT, Finance, Healthcare, etc.)

---

## Future Enhancements

- [ ] Allow manual editing of target roles in UI
- [ ] Add synonym mapping ("Developer" = "Engineer" = "Programmer")
- [ ] Use NLP/AI for semantic role matching (OpenAI embeddings)
- [ ] Multi-language support (Afrikaans job titles)
- [ ] Real-time role suggestions as user types

---

## API Integration Notes

### For External Job Boards

When integrating with Indeed, LinkedIn, etc.:

```javascript
const engine = getAutoApplyEngine(config);

// Custom submitter that posts to external API
engine.setSubmitter(async (job, config) => {
  const response = await fetch('https://api.jobboard.com/apply', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      jobId: job.id,
      cvData: config.cvData,
      desiredRoles: config.cvData.desiredRoles // Include target roles
    })
  });
  
  return response.ok;
});

await engine.start(jobs);
```

---

## Troubleshooting

### No roles extracted?
- Check CV has clear job titles in experience section
- Add career objective/summary at top
- System will fallback to score-based matching

### Bot not applying to expected jobs?
- Check job title contains keywords from your desired roles
- Try including more variations in CV (e.g., "Web Developer" AND "Frontend Developer")
- Lower minMatchScore in settings as fallback

### Too many/few matches?
- Edit CV to include only target roles you want
- Use more specific titles ("Senior React Developer" vs generic "Developer")

---

## Questions?

Contact: support@futurelinked.co.za

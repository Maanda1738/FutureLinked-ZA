/**
 * API Endpoint: AI-Powered CV Editor
 * POST /api/edit-cv
 * 
 * Uses OpenAI to intelligently edit and improve CV content
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cvData, editType, customInstructions } = req.body;

    if (!cvData || !cvData.text) {
      return res.status(400).json({ error: 'CV data is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'AI editing is not available. OpenAI API key not configured.' 
      });
    }

    let editedCV;

    switch (editType) {
      case 'ats-optimize':
        editedCV = await optimizeForATS(cvData);
        break;
      case 'improve-language':
        editedCV = await improveLanguage(cvData);
        break;
      case 'add-keywords':
        editedCV = await addKeywords(cvData);
        break;
      case 'quantify-achievements':
        editedCV = await quantifyAchievements(cvData);
        break;
      case 'custom':
        editedCV = await customEdit(cvData, customInstructions);
        break;
      case 'complete-rewrite':
        editedCV = await completeRewrite(cvData);
        break;
      default:
        return res.status(400).json({ error: 'Invalid edit type' });
    }

    return res.status(200).json({
      success: true,
      originalText: cvData.text,
      editedText: editedCV.text,
      changes: editedCV.changes,
      improvements: editedCV.improvements,
      message: editedCV.message
    });

  } catch (error) {
    console.error('CV editing error:', error);
    return res.status(500).json({ 
      error: 'Failed to edit CV',
      details: error.message 
    });
  }
}

async function optimizeForATS(cvData) {
  const prompt = `You are an ATS (Applicant Tracking System) optimization expert. Transform this CV to be highly ATS-compatible while keeping all information accurate.

ORIGINAL CV:
${cvData.text}

REQUIREMENTS:
1. Remove all tables, text boxes, graphics, and convert to simple text format
2. Use standard section headers: CONTACT, SUMMARY, EXPERIENCE, EDUCATION, SKILLS
3. Use simple bullet points (•) not special symbols
4. Use standard date formats (e.g., "Jan 2020 - Dec 2023")
5. Remove headers, footers, page numbers
6. Add relevant keywords naturally throughout
7. Ensure contact info is at the top in plain text
8. Make each bullet point start with a strong action verb
9. Keep formatting simple with clear hierarchy

Return ONLY the reformatted CV text. Make it ATS-friendly while keeping all original information.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS optimization specialist. Reformat CVs for maximum ATS compatibility.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000
    })
  });

  const data = await response.json();
  const editedText = data.choices[0].message.content.trim();

  return {
    text: editedText,
    changes: [
      'Removed complex formatting and tables',
      'Standardized section headers',
      'Simplified bullet points',
      'Optimized for ATS parsing'
    ],
    improvements: 'Your CV is now highly ATS-compatible and will parse correctly in 95%+ of applicant tracking systems.',
    message: 'CV optimized for ATS systems'
  };
}

async function improveLanguage(cvData) {
  const prompt = `You are a professional CV writer. Improve the language, grammar, and impact of this CV without changing any facts.

ORIGINAL CV:
${cvData.text}

IMPROVEMENTS TO MAKE:
1. Strengthen all action verbs (use achieved, spearheaded, orchestrated, etc.)
2. Fix grammar and spelling errors
3. Make language more professional and impactful
4. Improve sentence structure for clarity
5. Make achievements sound more impressive (but stay truthful)
6. Remove weak language (like "helped", "tried", "assisted" - make it stronger)
7. Ensure consistent tense (past tense for old roles, present for current)
8. Add power words and professional terminology

Return the improved CV text with better language throughout.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV writer who improves language impact while keeping facts accurate.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 3000
    })
  });

  const data = await response.json();
  const editedText = data.choices[0].message.content.trim();

  return {
    text: editedText,
    changes: [
      'Strengthened action verbs',
      'Fixed grammar and spelling',
      'Improved professional tone',
      'Enhanced impact of achievements'
    ],
    improvements: 'Your CV now uses more powerful language and makes a stronger impression on recruiters.',
    message: 'Language and impact improved'
  };
}

async function addKeywords(cvData) {
  const prompt = `You are a CV optimization expert specializing in keyword optimization. Add relevant industry keywords to this CV to improve job matching.

ORIGINAL CV:
${cvData.text}

TASK:
1. Identify the candidate's industry and target roles
2. Add 15-20 relevant industry keywords naturally throughout the CV
3. Include technical skills, soft skills, and industry terminology
4. Add keywords to existing bullet points (don't change meaning)
5. Ensure keywords flow naturally - no keyword stuffing
6. Focus on high-demand skills for the industry

Return the CV with keywords added naturally throughout.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a keyword optimization expert who adds relevant keywords naturally to CVs.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 3000
    })
  });

  const data = await response.json();
  const editedText = data.choices[0].message.content.trim();

  return {
    text: editedText,
    changes: [
      'Added relevant industry keywords',
      'Optimized for job matching algorithms',
      'Included in-demand skills',
      'Improved searchability'
    ],
    improvements: 'Your CV now contains more keywords that recruiters and ATS systems are searching for.',
    message: 'Keywords added for better matching'
  };
}

async function quantifyAchievements(cvData) {
  const prompt = `You are a CV consultant specializing in quantifying achievements. Add numbers, metrics, and quantifiable results to this CV.

ORIGINAL CV:
${cvData.text}

TASK:
1. Identify achievements that can be quantified
2. Add realistic numbers and metrics (use ranges like "10-15" if exact unknown)
3. Include percentages, time savings, revenue impact, team sizes, etc.
4. Make achievements measurable and impressive
5. Use formats like: "Increased X by Y%", "Managed team of Z", "Reduced costs by $X"
6. If you can't quantify something accurately, suggest placeholders like "[X%]" for user to fill in

Return the CV with quantified achievements throughout.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a CV expert who quantifies achievements with realistic numbers and metrics.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 3000
    })
  });

  const data = await response.json();
  const editedText = data.choices[0].message.content.trim();

  return {
    text: editedText,
    changes: [
      'Added quantifiable metrics',
      'Included impact numbers',
      'Made achievements measurable',
      'Added percentages and figures'
    ],
    improvements: 'Your achievements are now quantified with numbers, making your impact clear and impressive.',
    message: 'Achievements quantified with metrics'
  };
}

async function customEdit(cvData, instructions) {
  const prompt = `You are a professional CV editor. Edit this CV according to the user's specific instructions.

ORIGINAL CV:
${cvData.text}

USER INSTRUCTIONS:
${instructions}

Make the requested changes while keeping the CV professional and accurate. Return the edited CV.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional CV editor who follows user instructions precisely.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 3000
    })
  });

  const data = await response.json();
  const editedText = data.choices[0].message.content.trim();

  return {
    text: editedText,
    changes: ['Applied custom edits per your instructions'],
    improvements: 'Your CV has been edited according to your specific requirements.',
    message: 'Custom edits applied'
  };
}

async function completeRewrite(cvData) {
  const prompt = `You are a professional CV writer. Completely rewrite this CV to professional standards while keeping all factual information accurate.

ORIGINAL CV:
${cvData.text}

CREATE A PROFESSIONAL CV WITH:
1. Clear CONTACT section at top
2. Compelling PROFESSIONAL SUMMARY (2-3 sentences)
3. WORK EXPERIENCE with strong bullet points
4. EDUCATION with relevant qualifications
5. SKILLS section with categorized skills
6. Achievement-focused language
7. Quantified results where possible
8. ATS-friendly formatting
9. No spelling or grammar errors
10. Professional tone throughout

Return a completely rewritten, professional CV that would impress any recruiter.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional CV writer who creates exceptional, recruiter-approved CVs.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 3500
    })
  });

  const data = await response.json();
  const editedText = data.choices[0].message.content.trim();

  return {
    text: editedText,
    changes: [
      'Complete professional rewrite',
      'Added professional summary',
      'Restructured all sections',
      'Enhanced language and impact',
      'Optimized for ATS and recruiters'
    ],
    improvements: 'Your CV has been completely rewritten to professional standards. Review and personalize as needed.',
    message: 'CV professionally rewritten'
  };
}

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateText } from '@/lib/ai/vertex';
import { translate } from 'lingo.dev';

export async function POST(request: Request) {
  const supabase = createServerClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { jobId, targetLanguage = 'en' } = await request.json();

  try {
    // 1. Fetch user profile data
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: experiences } = await supabase
      .from('experience')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });

    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });

    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, email, phone, location')
      .eq('id', user.id)
      .single();

    // 2. Fetch job details
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // 3. Generate resume with AI
    const prompt = `You are a professional resume writer. Generate a tailored resume for this job application.

JOB DETAILS:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Requirements: ${job.requirements || 'Not specified'}

USER PROFILE:
Name: ${profileData?.full_name || 'Not provided'}
Summary: ${profile?.summary || 'Not provided'}
Skills: ${profile?.skills?.join(', ') || 'None listed'}

WORK EXPERIENCE:
${experiences
  ?.map(
    (exp) => `
- ${exp.position} at ${exp.company} (${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date})
  Location: ${exp.location}
  ${exp.description}
`
  )
  .join('\n')}

EDUCATION:
${education
  ?.map(
    (edu) => `
- ${edu.degree} in ${edu.field_of_study} from ${edu.institution}
  ${edu.start_date} - ${edu.end_date}
  ${edu.description || ''}
`
  )
  .join('\n')}

INSTRUCTIONS:
1. Create a professional resume tailored specifically for this job
2. Highlight relevant experience and skills
3. Use strong action verbs and quantify achievements where possible
4. Keep it concise and ATS-friendly
5. Return ONLY valid JSON in this exact format (no markdown, no extra text):

{
  "summary": "A compelling professional summary (2-3 sentences)",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "Start Date - End Date",
      "achievements": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "Graduation Year"
    }
  ]
}`;

    const aiResponse = await generateText(prompt, 3000);

    // Parse AI response
    let resumeContent;
    try {
      // Try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resumeContent = JSON.parse(jsonMatch[0]);
      } else {
        resumeContent = JSON.parse(aiResponse);
      }
    } catch {
      console.error('Failed to parse AI response:', aiResponse);
      return NextResponse.json(
        { error: 'Failed to generate resume. Please try again.' },
        { status: 500 }
      );
    }

    // 4. Translate resume if needed
    let finalResume = resumeContent;
    if (targetLanguage !== 'en') {
      finalResume = {
        summary: await translate(resumeContent.summary, { to: targetLanguage }),
        experience: await Promise.all(
          resumeContent.experience.map(async (exp: any) => ({
            ...exp,
            position: await translate(exp.position, { to: targetLanguage }),
            achievements: await Promise.all(
              exp.achievements.map((ach: string) =>
                translate(ach, { to: targetLanguage })
              )
            ),
          }))
        ),
        skills: await Promise.all(
          resumeContent.skills.map((skill: string) =>
            translate(skill, { to: targetLanguage })
          )
        ),
        education: await Promise.all(
          resumeContent.education.map(async (edu: any) => ({
            ...edu,
            degree: await translate(edu.degree, { to: targetLanguage }),
          }))
        ),
      };
    }

    // 5. Calculate ATS score
    const scorePrompt = `Rate this resume against the job requirements on a scale of 0-100.

JOB REQUIREMENTS:
${job.description}
${job.requirements}

RESUME:
${JSON.stringify(finalResume, null, 2)}

Return ONLY valid JSON in this format (no markdown):
{
  "score": 85,
  "feedback": "Brief feedback on strengths and areas for improvement"
}`;

    const scoreResponse = await generateText(scorePrompt, 500);
    const scoreMatch = scoreResponse.match(/\{[\s\S]*\}/);
    const { score, feedback } = scoreMatch
      ? JSON.parse(scoreMatch[0])
      : { score: 75, feedback: 'Unable to generate detailed feedback' };

    // 6. Rewrite if score < 70
    let attempts = 1;
    let currentResume = finalResume;
    let currentScore = score;

    while (currentScore < 70 && attempts < 3) {
      const rewritePrompt = `Improve this resume based on the feedback to better match the job requirements.

JOB:
${job.title} at ${job.company}
${job.description}

CURRENT RESUME:
${JSON.stringify(currentResume, null, 2)}

FEEDBACK:
${feedback}

Return an improved resume in the same JSON format.`;

      const rewriteResponse = await generateText(rewritePrompt, 3000);
      const rewriteMatch = rewriteResponse.match(/\{[\s\S]*\}/);

      if (rewriteMatch) {
        currentResume = JSON.parse(rewriteMatch[0]);

        // Recalculate score
        const newScoreResponse = await generateText(scorePrompt, 500);
        const newScoreMatch = newScoreResponse.match(/\{[\s\S]*\}/);
        if (newScoreMatch) {
          const newScoreData = JSON.parse(newScoreMatch[0]);
          currentScore = newScoreData.score;
        }
      }

      attempts++;
    }

    // 7. Save to database
    const { data: savedResume, error: saveError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        job_id: jobId,
        title: `${job.title} at ${job.company}`,
        content: currentResume,
        target_language: targetLanguage,
        ats_score: currentScore,
        ats_feedback: feedback,
        generation_attempts: attempts,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({
      resume: savedResume,
      score: currentScore,
      feedback,
      attempts,
    });
  } catch (error: any) {
    console.error('Resume generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate resume' },
      { status: 500 }
    );
  }
}

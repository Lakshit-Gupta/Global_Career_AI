import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractTextFromPDF, cleanExtractedText } from '@/lib/latex/parser';
import { compileLatex, LatexFile, validateLatexFiles } from '@/lib/latex/compiler';
import { fillProfessionalTemplate } from '@/lib/latex/templates/professional';
import { fillModernTemplate } from '@/lib/latex/templates/modern';
import {
  researchCompany,
  optimizeResumeContent,
  scoreResume,
  improveResumeData,
} from '@/lib/resume/optimizer';
import { ResumeData, TemplateType } from '@/types/resume';

const ATS_THRESHOLD = 80; // Configurable hyperparameter
const MAX_ATTEMPTS = 3;

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const pdfFile = formData.get('resume') as File;
  const companyName = formData.get('companyName') as string;
  const role = formData.get('role') as string;
  const template = (formData.get('template') as TemplateType) || 'professional';

  if (!pdfFile || !companyName || !role) {
    return NextResponse.json(
      { error: 'PDF resume, company name, and role are required' },
      { status: 400 }
    );
  }

  if (!pdfFile.name.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json(
      { error: 'Only PDF files are accepted' },
      { status: 400 }
    );
  }

  try {
    // STEP 1: Extract text from uploaded PDF
    console.log('📄 Step 1: Extracting text from PDF...');
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const { text: extractedText } = await extractTextFromPDF(pdfBuffer);
    const cleanedText = cleanExtractedText(extractedText);

    if (!cleanedText || cleanedText.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from PDF. Please ensure the PDF is text-based, not scanned.' },
        { status: 400 }
      );
    }

    // STEP 2: Research company using SerpAPI
    console.log('🔍 Step 2: Researching company...');
    const companyResearch = await researchCompany(companyName, role);

    // STEP 3: LLM optimizes resume content (NOT LaTeX)
    console.log('📝 Step 3: Optimizing resume content with AI...');
    let resumeData: ResumeData = await optimizeResumeContent(
      cleanedText,
      companyResearch,
      role
    );

    // STEP 4: Fill LaTeX template with optimized content
    console.log(`📋 Step 4: Filling ${template} LaTeX template...`);
    let latexFiles: LatexFile[] = [];
    let mainFile = 'main.tex';

    if (template === 'professional') {
      const filledTemplate = fillProfessionalTemplate(resumeData);
      latexFiles = [{ filename: 'main.tex', content: filledTemplate }];
      mainFile = 'main.tex';
    } else {
      // Modern template
      const filledTemplates = fillModernTemplate(resumeData);
      latexFiles = [
        { filename: 'altacv.cls', content: filledTemplates['altacv.cls'] },
        { filename: 'page1sidebar.tex', content: filledTemplates['page1sidebar.tex'] },
        { filename: 'mmayer.tex', content: filledTemplates['mmayer.tex'] },
      ];
      mainFile = 'mmayer.tex';
      
      // DEBUG: Log file creation
      console.log('🔍 Modern template files:');
      latexFiles.forEach(f => {
        console.log(`  - ${f.filename}: ${f.content.length} bytes`);
        console.log(`    First 100 chars: ${f.content.substring(0, 100)}`);
      });
    }

    // Validate LaTeX files
    const validation = validateLatexFiles(latexFiles, mainFile);
    if (!validation.valid) {
      throw new Error(`LaTeX validation failed: ${validation.error}`);
    }

    // STEP 5: Compile LaTeX to PDF
    console.log('🔨 Step 5: Compiling LaTeX to PDF...');
    const compilationResult = await compileLatex(latexFiles, mainFile);

    if (!compilationResult.success || !compilationResult.pdf) {
      console.error('LaTeX compilation error:', compilationResult.error);
      throw new Error(`LaTeX compilation failed: ${compilationResult.error || 'Unknown error'}`);
    }

    // STEP 6: Extract text from generated PDF for scoring
    console.log('📄 Step 6: Extracting text from generated PDF...');
    const { text: generatedText } = await extractTextFromPDF(compilationResult.pdf);

    // STEP 7: Score resume
    console.log('📊 Step 7: Scoring resume with ATS...');
    let atsResult = await scoreResume(generatedText, companyResearch, role);

    let attempts = 1;
    const scoreHistory = [{ attempt: 1, score: atsResult.score }];

    // STEP 8: Iteration loop if score < threshold
    while (atsResult.score < ATS_THRESHOLD && attempts < MAX_ATTEMPTS) {
      console.log(
        `🔄 Step 8.${attempts}: Score ${atsResult.score} < ${ATS_THRESHOLD}. Improving...`
      );

      // LLM improves resume DATA (not LaTeX)
      resumeData = await improveResumeData(
        resumeData,
        atsResult,
        companyResearch,
        role
      );

      // Refill LaTeX templates with improved data
      if (template === 'professional') {
        const filledTemplate = fillProfessionalTemplate(resumeData);
        latexFiles = [{ filename: 'main.tex', content: filledTemplate }];
      } else {
        const filledTemplates = fillModernTemplate(resumeData);
        latexFiles = [
          { filename: 'altacv.cls', content: filledTemplates['altacv.cls'] },
          { filename: 'page1sidebar.tex', content: filledTemplates['page1sidebar.tex'] },
          { filename: 'mmayer.tex', content: filledTemplates['mmayer.tex'] },
        ];
      }

      // Recompile
      const recompileResult = await compileLatex(latexFiles, mainFile);
      if (!recompileResult.success || !recompileResult.pdf) {
        console.error('Recompilation error:', recompileResult.error);
        break; // Stop iterating if compilation fails
      }

      // Re-extract text and re-score
      const { text: newGeneratedText } = await extractTextFromPDF(recompileResult.pdf);
      atsResult = await scoreResume(newGeneratedText, companyResearch, role);
      attempts++;
      scoreHistory.push({ attempt: attempts, score: atsResult.score });

      // Update PDF buffer for final save
      compilationResult.pdf = recompileResult.pdf;

      console.log(`   New score: ${atsResult.score}`);
    }

    console.log(
      `✅ Complete! Final score: ${atsResult.score} after ${attempts} attempt(s)`
    );

    // STEP 9: Save to Supabase Storage and Database
    console.log('💾 Step 9: Saving to database...');
    
    // Upload PDF to Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${companyName.replace(/\s+/g, '_')}_${role.replace(/\s+/g, '_')}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, compilationResult.pdf, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    // Store LaTeX source as JSON
    const latexSource: Record<string, string> = {};
    latexFiles.forEach((file) => {
      latexSource[file.filename] = file.content;
    });

    // Save metadata to database
    const { data: savedResume, error: saveError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        title: `${role} at ${companyName}`,
        content: {
          resumeData,
          companyResearch,
        } as any,
        file_url: urlData.publicUrl,
        ats_score: atsResult.score,
        ats_feedback: atsResult.feedback as any,
        generation_attempts: attempts,
        target_language: 'en',
        template_used: template,
        latex_source: latexSource as any,
        company_name: companyName,
        role_target: role,
        iteration_count: attempts,
        original_filename: pdfFile.name,
      } as any)
      .select()
      .single();

    if (saveError) {
      console.error('Database save error:', saveError);
      throw saveError;
    }

    return NextResponse.json({
      success: true,
      resumeId: (savedResume as any)?.id,
      score: atsResult.score,
      feedback: atsResult.feedback,
      improvements: atsResult.improvements,
      attempts,
      scoreHistory,
      companyResearch: {
        name: companyResearch.name,
        techStack: companyResearch.techStack,
      },
      downloadUrl: urlData.publicUrl,
      template,
    });
  } catch (error: any) {
    console.error('❌ Resume optimization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to optimize resume' },
      { status: 500 }
    );
  }
}

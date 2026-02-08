'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';

export default function GenerateResumePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [job, setJob] = useState<any>(null);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const supabase = createClient();

  const loadJob = useCallback(async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (data) {
      setJob(data);
      // Auto-detect job language and set as target
      setTargetLanguage(data.original_language || 'en');
    }
  }, [jobId, supabase]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (jobId) {
      loadJob();
    }
  }, [user, jobId, router, loadJob]);

  async function handleGenerate() {
    setGenerating(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          targetLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate resume');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  if (!job) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Generate Resume</h1>
      <p className="text-gray-600 mb-8">
        AI will create a tailored resume for this position
      </p>

      {/* Job Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
        <p className="text-gray-600 mb-4">{job.company}</p>
        <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
      </div>

      {/* Language Selection */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-2">
          Resume Language
        </label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="fr">French</option>
          <option value="ja">Japanese</option>
          <option value="pt">Portuguese</option>
          <option value="zh">Chinese</option>
        </select>
        <p className="text-sm text-gray-500 mt-2">
          Generate resume in the job&apos;s language for better results
        </p>
      </div>

      {/* Generate Button */}
      {!result && (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold text-lg"
        >
          {generating ? 'Generating Resume...' : 'Generate Resume with AI'}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-6">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* ATS Score */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">ATS Score</h3>
              <div className="text-4xl font-bold text-blue-600">
                {result.score}/100
              </div>
            </div>
            <div
              className={`p-4 rounded-lg ${
                result.score >= 70
                  ? 'bg-green-50 text-green-700'
                  : 'bg-yellow-50 text-yellow-700'
              }`}
            >
              {result.feedback}
            </div>
            {result.attempts > 1 && (
              <p className="text-sm text-gray-500 mt-2">
                Generated in {result.attempts} attempts
              </p>
            )}
          </div>

          {/* Resume Preview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Resume Preview</h3>

            {/* Summary */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Professional Summary</h4>
              <p className="text-gray-700">{result.resume.content.summary}</p>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Experience</h4>
              {result.resume.content.experience.map((exp: any, i: number) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between">
                    <p className="font-medium">{exp.position}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {exp.achievements.map((ach: string, j: number) => (
                      <li key={j} className="text-sm text-gray-700">
                        {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {result.resume.content.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="font-semibold mb-2">Education</h4>
              {result.resume.content.education.map((edu: any, i: number) => (
                <div key={i} className="mb-2">
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-gray-600">
                    {edu.institution} • {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/resume/${result.resume.id}`)}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Full Resume
            </button>
            <button
              onClick={() =>
                router.push(`/applications/new?resumeId=${result.resume.id}&jobId=${jobId}`)
              }
              className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

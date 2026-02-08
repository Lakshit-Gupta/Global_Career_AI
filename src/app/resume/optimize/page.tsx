'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';

type TemplateType = 'professional' | 'modern';

export default function ResumeOptimizerPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Form state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [template, setTemplate] = useState<TemplateType>('professional');

  // Process state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setPdfFile(file);
    setError('');
  };

  const handleOptimize = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!pdfFile || !companyName.trim() || !role.trim()) {
      setError('Please upload a PDF resume, enter company name, and role');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setProgress('📄 Extracting text from PDF...');

    try {
      const formData = new FormData();
      formData.append('resume', pdfFile);
      formData.append('companyName', companyName);
      formData.append('role', role);
      formData.append('template', template);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const messages = [
          '📄 Extracting text from PDF...',
          '🔍 Researching company...',
          '🤖 AI optimizing resume content...',
          '📋 Filling LaTeX template...',
          '🔨 Compiling to PDF...',
          '📊 Scoring with ATS...',
        ];
        setProgress(messages[Math.floor(Math.random() * messages.length)]);
      }, 3000);

      const response = await fetch('/api/resume/optimize', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to optimize resume');
      }

      setResult(data);
      setProgress('');
    } catch (err: any) {
      setError(err.message);
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Resume Optimizer
          </h1>
          <p className="text-lg text-gray-600">
            PDF Upload → AI Optimization → Professional LaTeX Resume • ATS Score Target: 80+
          </p>
        </div>

        {!result ? (
          /* INPUT FORM */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Resume Upload */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Upload Your Resume (PDF)
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (.pdf) *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      required
                    />
                  </div>
                  {pdfFile && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    📋 Upload a text-based PDF resume (not scanned images). Max 10MB.
                  </p>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose LaTeX Template *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTemplate('professional')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        template === 'professional'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">Professional</div>
                      <div className="text-xs text-gray-600">
                        Clean single-column layout. Best for traditional industries.
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplate('modern')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        template === 'modern'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">Modern</div>
                      <div className="text-xs text-gray-600">
                        Sidebar design with visual appeal. Best for tech/creative roles.
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Company Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Target Company & Role
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Google, Microsoft, OpenAI"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role *
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., Senior Software Engineer, ML Engineer"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  New Workflow (PDF → LaTeX)
                </h3>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-semibold">1.</span>
                    <span>Extract text from your PDF resume</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">2.</span>
                    <span>SerpAPI researches company (tech stack, culture)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">3.</span>
                    <span>AI optimizes resume content (OpenRouter)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">4.</span>
                    <span>Fill chosen LaTeX template with optimized content</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">5.</span>
                    <span>Compile to professional PDF (LaTeX Online API)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">6.</span>
                    <span>ATS score & iterate until ≥80 (max 3 attempts)</span>
                  </li>
                </ol>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleOptimize}
                disabled={loading || !pdfFile}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {progress}
                  </>
                ) : (
                  <>
                    <span className="text-xl">🚀</span>
                    Optimize Resume with AI
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* RESULTS VIEW */
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    ATS Compatibility Score
                  </h2>
                  <p className="text-gray-600">
                    Optimized in {result.attempts} attempt{result.attempts > 1 ? 's' : ''} • Template: {result.template}
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`text-7xl font-black ${
                      result.score >= 80
                        ? 'text-green-600'
                        : result.score >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {result.score}
                  </div>
                  <div className="text-2xl text-gray-400 font-semibold">/100</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                {result.score >= 80 ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ATS Optimized - Ready to Submit!
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Needs Improvement
                  </div>
                )}
              </div>

              {/* Company Research */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Company Research</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{result.companyResearch.name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.companyResearch.techStack.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">AI Feedback</h3>
                {result.feedback && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">{result.feedback}</p>
                  </div>
                )}
                
                {result.improvements && result.improvements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Improvements Made:</h4>
                    <ul className="space-y-2">
                      {result.improvements.map((improvement: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-green-600">✓</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Score History */}
              {result.scoreHistory && result.scoreHistory.length > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Score Progress</h3>
                  <div className="flex items-center gap-3">
                    {result.scoreHistory.map((item: any, i: number) => (
                      <div key={i} className="flex-1">
                        <div className="text-center mb-1">
                          <div className="text-2xl font-bold text-gray-900">{item.score}</div>
                          <div className="text-xs text-gray-500">Attempt {item.attempt}</div>
                        </div>
                        {i < result.scoreHistory.length - 1 && (
                          <div className="text-center text-gray-400">→</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Button */}
              <div className="mt-8 flex gap-4">
                <a
                  href={result.downloadUrl}
                  download
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Optimized Resume (PDF)
                </a>
                <button
                  onClick={() => {
                    setResult(null);
                    setPdfFile(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Optimize Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

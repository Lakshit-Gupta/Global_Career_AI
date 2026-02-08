'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';

interface Experience {
  id?: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description: string;
}

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Profile data
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([{
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: ''
  }]);

  // Education
  const [education, setEducation] = useState<Education[]>([{
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    description: ''
  }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadExistingProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadExistingProfile() {
    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (profile) {
        setSummary((profile as any).summary || '');
        setSkills((profile as any).skills || []);
      }

      // Load experience
      const { data: exp } = await supabase
        .from('experience')
        .select('*')
        .eq('user_id', user!.id)
        .order('start_date', { ascending: false });

      if (exp && exp.length > 0) {
        setExperiences(exp as any);
      }

      // Load education
      const { data: edu } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user!.id)
        .order('start_date', { ascending: false });

      if (edu && edu.length > 0) {
        setEducation(edu as any);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addExperience = () => {
    setExperiences([...experiences, {
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: ''
    }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, {
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      description: ''
    }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Save user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user!.id,
          summary,
          skills,
          updated_at: new Date().toISOString()
        } as any);

      if (profileError) throw profileError;

      // Delete existing experience and education
      await supabase.from('experience').delete().eq('user_id', user!.id);
      await supabase.from('education').delete().eq('user_id', user!.id);

      // Save experience
      const validExperiences = experiences.filter(exp => exp.company && exp.position);
      if (validExperiences.length > 0) {
        const { error: expError } = await supabase
          .from('experience')
          .insert(
            validExperiences.map(exp => ({
              user_id: user!.id,
              ...exp
            })) as any
          );
        if (expError) throw expError;
      }

      // Save education
      const validEducation = education.filter(edu => edu.institution && edu.degree);
      if (validEducation.length > 0) {
        const { error: eduError } = await supabase
          .from('education')
          .insert(
            validEducation.map(edu => ({
              user_id: user!.id,
              ...edu
            })) as any
          );
        if (eduError) throw eduError;
      }

      // Redirect to dashboard
      router.push('/jobs');
    } catch (err: any) {
      setError(err.message);
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>
      <p className="text-gray-600 mb-8">
        This information will be used to generate tailored resumes for jobs
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Professional Summary */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Professional Summary</h2>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write a brief summary about yourself and your career goals..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </section>

        {/* Skills */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill (e.g., React, Python, AWS)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-blue-900 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Work Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Experience
            </button>
          </div>

          {experiences.map((exp, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-lg">Experience {index + 1}</h3>
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Position *</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 mt-7">
                    <input
                      type="checkbox"
                      checked={exp.is_current}
                      onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Currently working here</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={exp.start_date}
                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {!exp.is_current && (
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date *</label>
                    <input
                      type="date"
                      value={exp.end_date}
                      onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                      required={!exp.is_current}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Education</h2>
            <button
              type="button"
              onClick={addEducation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Education
            </button>
          </div>

          {education.map((edu, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-lg">Education {index + 1}</h3>
                {education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Institution *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Degree *</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    required
                    placeholder="e.g., Bachelor of Science"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field_of_study}
                    onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div></div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={edu.start_date}
                    onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={edu.end_date}
                    onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={edu.description}
                  onChange={(e) => updateEducation(index, 'description', e.target.value)}
                  placeholder="Additional details, honors, relevant coursework..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ))}
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/jobs')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

import { ResumeData } from '@/types/resume';

export const PROFESSIONAL_TEMPLATE_BASE = String.raw`%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{fontawesome5}
\usepackage{multicol}
\setlength{\multicolsep}{-3.0pt}
\setlength{\columnsep}{-1pt}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.6in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1.19in}
\addtolength{\topmargin}{-.7in}
\addtolength{\textheight}{1.4in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & \textbf{\small #2} \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{1.001\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & \textbf{\small #2}\\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemi{$\vcenter{\hbox{\tiny$\bullet$}}$}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.0in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\begin{document}

%----------HEADING----------
\begin{center}
    {\Huge \scshape {{NAME}}} \\ \vspace{1pt}
    {{LOCATION}} \\ \vspace{1pt}
    \small \raisebox{-0.1\height}\faPhone\ {{PHONE}} ~ 
    \href{mailto:{{EMAIL}}}{\raisebox{-0.2\height}\faEnvelope\  \underline{{{EMAIL}}}} ~ 
    {{LINKEDIN_SECTION}}
    {{GITHUB_SECTION}}
    \vspace{-8pt}
\end{center}

{{SUMMARY_SECTION}}

%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
{{EDUCATION_ITEMS}}
  \resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\section{Experience}
  \resumeSubHeadingListStart
{{EXPERIENCE_ITEMS}}
  \resumeSubHeadingListEnd

%-----------CORE SKILLS-----------
\section{Core Skills}
\begin{itemize}[leftmargin=0.15in, label={}]
  \small{\item{
{{SKILLS_ITEMS}}
  }}
\end{itemize}

%-----------PROJECTS-----------
\section{Projects}
\vspace{-4pt}
  \resumeSubHeadingListStart
{{PROJECT_ITEMS}}
  \resumeSubHeadingListEnd
\vspace{-6pt}

\end{document}
`;

function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    // Normalize Unicode to ASCII equivalents first
    .normalize('NFKD')
    // Replace various Unicode spaces with regular space
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    // Replace em/en dashes with regular dash
    .replace(/[\u2013\u2014]/g, '-')
    // Replace smart quotes with regular quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Replace bullet points with *
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '* ')
    // Remove other problematic Unicode characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Standard LaTeX escaping
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    // Replace newlines with space
    .replace(/\n/g, ' ')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

export function fillProfessionalTemplate(data: ResumeData): string {
  let template = PROFESSIONAL_TEMPLATE_BASE;

  // Fill contact information
  template = template.replace(/{{NAME}}/g, escapeLatex(data.contact.name));
  template = template.replace(/{{EMAIL}}/g, escapeLatex(data.contact.email));
  template = template.replace(/{{PHONE}}/g, escapeLatex(data.contact.phone));
  template = template.replace(/{{LOCATION}}/g, escapeLatex(data.contact.location));

  // LinkedIn section
  const linkedinSection = data.contact.linkedin
    ? `\\href{${escapeLatex(data.contact.linkedin)}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{linkedin.com}} ~`
    : '';
  template = template.replace(/{{LINKEDIN_SECTION}}/g, linkedinSection);

  // GitHub section
  const githubSection = data.contact.github
    ? `\\href{${escapeLatex(data.contact.github)}}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{github.com}}`
    : '';
  template = template.replace(/{{GITHUB_SECTION}}/g, githubSection);

  // Summary section
  const summarySection = data.summary
    ? `%-----------SUMMARY-----------
\\section{Professional Summary}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
    ${escapeLatex(data.summary)}
  }}
\\end{itemize}
`
    : '';
  template = template.replace(/{{SUMMARY_SECTION}}/g, summarySection);

  // Education items
  const educationItems = data.education && data.education.length > 0
    ? data.education
        .map(
          (edu) => `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.year)}}
      {${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}${edu.gpa ? `, GPA: ${escapeLatex(edu.gpa)}` : ''}}{${escapeLatex(edu.location)}}`
        )
        .join('\n')
    : `    \\resumeSubheading
      {University Name}{2018 - 2022}
      {Bachelor of Science in Computer Science}{City, State}`;
  template = template.replace(/{{EDUCATION_ITEMS}}/g, educationItems);

  // Experience items
  const experienceItems = data.experience && data.experience.length > 0
    ? data.experience
        .map((exp) => {
          const achievements = exp.achievements && exp.achievements.length > 0
            ? exp.achievements
                .map((ach) => `        \\resumeItem{${escapeLatex(ach)}}`)
                .join('\n')
            : `        \\resumeItem{Contributed to team success}`;
          return `    \\resumeSubheading
      {${escapeLatex(exp.position)}}{${escapeLatex(exp.duration)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
${achievements}
      \\resumeItemListEnd`;
        })
        .join('\n')
    : `    \\resumeSubheading
      {Position Title}{Jan 2020 - Present}
      {Company Name}{City, State}
      \\resumeItemListStart
        \\resumeItem{Led key initiatives}
      \\resumeItemListEnd`;
  template = template.replace(/{{EXPERIENCE_ITEMS}}/g, experienceItems);

  // Skills items
  const skillsItems = [];
  if (data.skills.technical?.length) {
    skillsItems.push(
      `    \\textbf{Technical Skills}: ${data.skills.technical.map(escapeLatex).join(', ')} \\\\`
    );
  }
  if (data.skills.tools?.length) {
    skillsItems.push(
      `    \\textbf{Tools \\& Technologies}: ${data.skills.tools.map(escapeLatex).join(', ')} \\\\`
    );
  }
  if (data.skills.languages?.length) {
    skillsItems.push(
      `    \\textbf{Programming Languages}: ${data.skills.languages.map(escapeLatex).join(', ')}`
    );
  }
  // Ensure we always have at least one skills item
  if (skillsItems.length === 0) {
    skillsItems.push(`    \\textbf{Skills}: Python, JavaScript, React, Node.js`);
  }
  template = template.replace(/{{SKILLS_ITEMS}}/g, skillsItems.join('\n'));

  // Project items
  const projectItems = data.projects && data.projects.length > 0
    ? data.projects
        .map((proj) => {
          const projectTitle = proj.link
            ? `\\textbf{${escapeLatex(proj.name)}} $|$ \\emph{${escapeLatex(proj.technologies)}} $|$ \\href{${escapeLatex(proj.link)}}{\\underline{Link}}`
            : `\\textbf{${escapeLatex(proj.name)}} $|$ \\emph{${escapeLatex(proj.technologies)}}`;

          const achievements = proj.achievements && proj.achievements.length > 0
            ? proj.achievements
                .map((ach) => `            \\resumeItem{${escapeLatex(ach)}}`)
                .join('\n')
            : `            \\resumeItem{${escapeLatex(proj.description || 'Project description')}}`;

          return `    \\resumeProjectHeading
        {${projectTitle}}{}
        \\resumeItemListStart
${achievements}
        \\resumeItemListEnd
        \\vspace{-13pt}`;
        })
        .join('\n')
    : `    \\resumeProjectHeading
        {\\textbf{Sample Project} $|$ \\emph{Technology Stack}}{}
        \\resumeItemListStart
            \\resumeItem{Built innovative solution}
        \\resumeItemListEnd
        \\vspace{-13pt}`;
  template = template.replace(/{{PROJECT_ITEMS}}/g, projectItems);

  return template;
}

import { ResumeData } from '@/types/resume';

// File 1: atlacv.cls (NEVER CHANGES - class definition file)
export const ATLACV_CLS = String.raw`%%%%%%%%%%%%%%%%%
% This is altacv.cls (v1.1.5, 1 December 2018) written by
% LianTze Lim (liantze@gmail.com).
%
%% It may be distributed and/or modified under the
%% conditions of the LaTeX Project Public License, either version 1.3
%% of this license or (at your option) any later version.

\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\@ifl@t@r\fmtversion{2018/04/01}{\UseRawInputEncoding}{}
\ProvidesClass{altacv}[2018/12/01 AltaCV v1.1.5, yet another alternative class for a resume/curriculum vitae.]

\newif\if@academicons
\DeclareOption{academicons}{\@academiconstrue}
\newif\if@normalphoto
\DeclareOption{normalphoto}{\@normalphototrue}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{extarticle}}
\newif\if@raggedtwoe
\DeclareOption{ragged2e}{\@raggedtwoetrue}
\ProcessOptions\relax

\LoadClass{extarticle}

\RequirePackage[margin=2cm]{geometry}
\RequirePackage{fontawesome}
\RequirePackage{ifxetex,ifluatex}
\RequirePackage{scrlfile}

\newif\ifxetexorluatex
\ifxetex
  \xetexorluatextrue
\else
  \ifluatex
    \xetexorluatextrue
  \else
    \xetexorluatexfalse
  \fi
\fi

\if@academicons
  \ifxetexorluatex
    \RequirePackage{fontspec}
    \@ifl@t@r\fmtversion{2018/04/01}{%
      \RequirePackage{academicons}
    }{%
      \@ifl@t@r\fmtversion{2017/04/01}{%
        \@ifpackagelater{academicons}{2018/03/01}{%
          \RequirePackage{academicons}
        }{%
          \let\ori@newfontfamily\newfontfamily%
          \renewcommand{\newfontfamily}[2]{}
          \RequirePackage{academicons}
          \let\newfontfamily\ori@newfontfamily
          \newfontfamily{\AI}{academicons.ttf}
        }
      }{%
          \let\ori@newfontfamily\newfontfamily%
          \renewcommand{\newfontfamily}[2]{}
          \RequirePackage{academicons}
          \let\newfontfamily\ori@newfontfamily
          \newfontfamily{\AI}{academicons.ttf}
      }
    }
  \else
    \ClassError{AltaCV}{academicons unsupported by latex or pdflatex. Please compile with xelatex or lualatex}{Please compile with xelatex or lualatex to use the academicons option}
  \fi
\fi

\if@raggedtwoe
  \RequirePackage[newcommands]{ragged2e}
\fi

\RequirePackage{xcolor}

\colorlet{accent}{blue!70!black}
\colorlet{heading}{black}
\colorlet{emphasis}{black}
\colorlet{body}{black!80!white}
\newcommand{\itemmarker}{{\small\textbullet}}
\newcommand{\ratingmarker}{\faCircle}

\RequirePackage{tikz}
\usetikzlibrary{arrows}
\RequirePackage[skins]{tcolorbox}
\RequirePackage{enumitem}
\setlist{leftmargin=*,labelsep=0.5em,nosep,itemsep=0.25\baselineskip,after=\vskip0.25\baselineskip}
\setlist[itemize]{label=\itemmarker}
\RequirePackage{graphicx}
\RequirePackage{etoolbox}
\RequirePackage{dashrule}
\RequirePackage{multirow,tabularx}
\RequirePackage{changepage}

\setlength{\parindent}{0pt}
\newcommand{\divider}{\textcolor{body!30}{\hdashrule{\linewidth}{0.6pt}{0.5ex}}\medskip}

\newenvironment{fullwidth}{%
  \begin{adjustwidth}{}{\dimexpr-\marginparwidth-\marginparsep\relax}}
  {\end{adjustwidth}}

\newcommand{\emailsymbol}{\faAt}
\newcommand{\phonesymbol}{\faPhone}
\newcommand{\homepagesymbol}{\faChain}
\newcommand{\locationsymbol}{\faMapMarker}
\newcommand{\linkedinsymbol}{\faLinkedin}
\newcommand{\twittersymbol}{\faTwitter}
\newcommand{\githubsymbol}{\faGithub}
\newcommand{\mailsymbol}{\faEnvelope}

\newcommand{\printinfo}[2]{\mbox{\textcolor{accent}{\normalfont #1}\hspace{0.5em}#2\hspace{2em}}}

\newcommand{\name}[1]{\def\@name{#1}}
\newcommand{\tagline}[1]{\def\@tagline{#1}}
\newcommand{\photo}[2]{\def\@photo{#2}\def\@photodiameter{#1}}
\newcommand{\email}[1]{\printinfo{\emailsymbol}{#1}}
\newcommand{\mailaddress}[1]{\printinfo{\mailsymbol}{#1}}
\newcommand{\phone}[1]{\printinfo{\phonesymbol}{#1}}
\newcommand{\homepage}[1]{\printinfo{\homepagesymbol}{#1}}
\newcommand{\twitter}[1]{\printinfo{\twittersymbol}{#1}}
\newcommand{\linkedin}[1]{\printinfo{\linkedinsymbol}{#1}}
\newcommand{\github}[1]{\printinfo{\githubsymbol}{#1}}
\newcommand{\location}[1]{\printinfo{\locationsymbol}{#1}}

\newcommand{\personalinfo}[1]{\def\@personalinfo{#1}}

\newcommand{\makecvheader}{%
  \begingroup
    \ifdef{\@photodiameter}{\begin{minipage}{\dimexpr\linewidth-\@photodiameter-2em}}{}%
    \raggedright\color{emphasis}%
    {\Huge\bfseries\MakeUppercase{\@name}\par}
    \medskip
    {\large\bfseries\color{accent}\@tagline\par}
    \medskip
    {\footnotesize\bfseries\@personalinfo\par}
    \ifdef{\@photodiameter}{%
    \end{minipage}\hfill%
    \begin{minipage}{\@photodiameter}
    \if@normalphoto
      \includegraphics[width=\linewidth]{\@photo}
    \else
      \tikz\path[fill overzoom image={\@photo}]circle[radius=0.5\linewidth];
    \fi%
    \end{minipage}\par}{}%
  \endgroup\medskip
}

\renewenvironment{quote}{\color{accent}\itshape\large}{\par}

\newcommand{\cvsection}[2][]{%
  \bigskip%
  \ifstrequal{#1}{}{}{\marginpar{\vspace*{\dimexpr1pt-\baselineskip}\raggedright\input{#1}}}%
  {\color{heading}\LARGE\bfseries\MakeUppercase{#2}}\\[-1ex]%
  {\color{heading}\rule{\linewidth}{2pt}\par}\medskip
}

\newcommand{\cvsubsection}[1]{%
  \smallskip%
  {\color{emphasis}\large\bfseries{#1}\par}\medskip
}

\newcommand{\cvevent}[4]{%
  {\large\color{emphasis}#1\par}
  \smallskip\normalsize
  \ifstrequal{#2}{}{}{
  \textbf{\color{accent}#2}\par
  \smallskip}
  \ifstrequal{#3}{}{}{{\small\makebox[0.5\linewidth][l]{\faCalendar\hspace{0.5em}#3}}}%
  \ifstrequal{#4}{}{}{{\small\makebox[0.5\linewidth][l]{\faMapMarker\hspace{0.5em}#4}}}\par
  \medskip\normalsize
}

\newcommand{\cvachievement}[3]{%
  \begin{tabularx}{\linewidth}{@{}p{2em} @{\hspace{1ex}} >{\raggedright\arraybackslash}X@{}}
  \multirow{4}{*}{\Large\color{accent}#1} & \bfseries\textcolor{emphasis}{#2}\\
  & #3
  \end{tabularx}%
}

\newcommand{\cvproject}[1]{%
  {\textbf{\color{accent}#1}\par}
  \smallskip\normalsize
}

\newcommand{\cvtag}[1]{%
  \tikz[baseline]\node[anchor=base,draw=body!30,rounded corners,inner xsep=1ex,inner ysep =0.75ex,text height=1.5ex,text depth=.25ex]{#1};
}

\newcommand{\cvskill}[2]{%
\textcolor{emphasis}{\textbf{#1}}\hfill
\foreach \x in {1,...,5}{%
  \space{\ifnumgreater{\x}{#2}{\color{body!30}}{\color{accent}}\ratingmarker}}\par%
}

\newcommand{\cvref}[3]{%
  \smallskip
  \textcolor{emphasis}{\textbf{#1}}\par
  \begin{description}[font=\color{accent},style=multiline,leftmargin=1.35em]
  \item[\normalfont\emailsymbol] #2
  \item[\small\normalfont\mailsymbol] #3
  \end{description}
}

\newenvironment{cvcolumn}[1]{\begin{minipage}[t]{#1}\raggedright}{\end{minipage}}

\RequirePackage[backend=biber,style=authoryear,sorting=ydnt]{biblatex}
\defbibheading{pubtype}{\cvsubsection{#1}}
\renewcommand{\bibsetup}{\vspace*{-\baselineskip}}
\AtEveryBibitem{\makebox[\bibhang][l]{\itemmarker}}
\setlength{\bibitemsep}{0.25\baselineskip}

\RequirePackage{afterpage}
\newcommand{\addsidebar}[2][]{\marginpar{%
  \ifstrequal{#1}{}{}{\vspace*{#1}}%
  \input{#2}}%
}
\newcommand{\addnextpagesidebar}[2][]{\afterpage{\addsidebar[#1]{#2}}}

\AtBeginDocument{%
  \pagestyle{empty}
  \color{body}
  \raggedright
}
`;

// File 2: page1sidebar.tex (LLM EDITS THIS - sidebar content)
export const PAGE1SIDEBAR_TEMPLATE_BASE = String.raw`\cvsection{Education}
{{EDUCATION_ITEMS}}

\cvsection{Projects}
{{PROJECT_ITEMS}}
`;

// File 3: mmayer.tex (LLM EDITS THIS - main content)
export const MMAYER_TEMPLATE_BASE = String.raw`\documentclass[10pt,a4paper,ragged2e]{altacv}
\geometry{left=2cm,right=10cm,marginparwidth=6.8cm,marginparsep=1.2cm,top=1.25cm,bottom=1.25cm}
\ifxetexorluatex
  \setmainfont{Carlito}
\else
  \usepackage[utf8]{inputenc}
  \usepackage[T1]{fontenc}
  \usepackage[default]{lato}
  \usepackage{hyperref}
  \hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,      
    urlcolor=blue,
    }
\fi
\definecolor{VividPurple}{HTML}{000000}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{2E2E2E}
\colorlet{heading}{VividPurple}
\colorlet{accent}{VividPurple}
\colorlet{emphasis}{SlateGrey}
\colorlet{body}{LightGrey}
\renewcommand{\itemmarker}{{\small\textbullet}}
\renewcommand{\ratingmarker}{\faCircle}
\addbibresource{sample.bib}

\begin{document}
\name{{{NAME}}}
\tagline{{{TAGLINE}}}
\personalinfo{%
  \phone{{{PHONE}}}
  \email{{{EMAIL}}}
  \location{{{LOCATION}}}
{{LINKEDIN_LINE}}
{{GITHUB_LINE}}
}

\begin{fullwidth}
\makecvheader
\end{fullwidth}

\AtBeginEnvironment{itemize}{\small}

\cvsection[page1sidebar]{Experience}

{{EXPERIENCE_ITEMS}}

{{SUMMARY_SECTION}}

\cvsection{TECHNICAL SKILLS}
\begin{itemize}
{{SKILLS_ITEMS}}
\end{itemize}

\clearpage

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

export function fillModernTemplate(data: ResumeData): {
  'altacv.cls': string;
  'page1sidebar.tex': string;
  'mmayer.tex': string;
} {
  // File 1: Class file (never changes)
  const altacvCls = ATLACV_CLS;

  // File 2: Sidebar content
  let sidebar = PAGE1SIDEBAR_TEMPLATE_BASE;

  // Education items for sidebar
  const educationItems = data.education
    .map(
      (edu) => `\\cvevent{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}${edu.gpa ? ` - ${escapeLatex(edu.gpa)} GPA` : ''}}{${escapeLatex(edu.institution)}}{${escapeLatex(edu.year)}}{${escapeLatex(edu.location)}}{}`
    )
    .join('\n');
  sidebar = sidebar.replace(/{{EDUCATION_ITEMS}}/g, educationItems);

  // Project items for sidebar
  const projectItems = data.projects
    .map((proj) => {
      const projectTitle = proj.link
        ? `\\cvproject{\\href{${escapeLatex(proj.link)}}{${escapeLatex(proj.name)}}}`
        : `\\cvproject{${escapeLatex(proj.name)}}`;

      const achievements =
        proj.achievements && proj.achievements.length > 0
          ? proj.achievements.map((ach) => `\\item ${escapeLatex(ach)}`).join('\n')
          : `\\item ${escapeLatex(proj.description)}`;

      return `${projectTitle}
\\begin{itemize}
\\item \\textbf{${escapeLatex(proj.technologies)}} 
${achievements}
\\end{itemize}
\\smallskip
\\smallskip`;
    })
    .join('\n');
  sidebar = sidebar.replace(/{{PROJECT_ITEMS}}/g, projectItems);

  // File 3: Main content
  let main = MMAYER_TEMPLATE_BASE;

  // Fill contact information
  main = main.replace(/{{NAME}}/g, escapeLatex(data.contact.name));
  main = main.replace(/{{TAGLINE}}/g, data.summary ? escapeLatex(data.summary.substring(0, 50)) : 'Professional');
  main = main.replace(/{{PHONE}}/g, escapeLatex(data.contact.phone));
  main = main.replace(/{{EMAIL}}/g, escapeLatex(data.contact.email));
  main = main.replace(/{{LOCATION}}/g, escapeLatex(data.contact.location));

  // LinkedIn line
  const linkedinLine = data.contact.linkedin
    ? `  \\linkedin{\\href{${escapeLatex(data.contact.linkedin)}}{LinkedIn}}`
    : '';
  main = main.replace(/{{LINKEDIN_LINE}}/g, linkedinLine);

  // GitHub line
  const githubLine = data.contact.github
    ? `  \\github{\\href{${escapeLatex(data.contact.github)}}{GitHub}}`
    : '';
  main = main.replace(/{{GITHUB_LINE}}/g, githubLine);

  // Experience items
  const experienceItems = data.experience
    .map((exp) => {
      const achievements = exp.achievements
        .map((ach) => `\\item ${escapeLatex(ach)}`)
        .join('\n');
      return `\\cvevent{\\textbf{${escapeLatex(exp.position)}}}{${escapeLatex(exp.company)}}{\\textbf{${escapeLatex(exp.duration)}}}{\\textbf{${escapeLatex(exp.location)}}}
\\begin{itemize}
${achievements}
\\end{itemize}
\\\\
\\divider`;
    })
    .join('\n\n');
  main = main.replace(/{{EXPERIENCE_ITEMS}}/g, experienceItems);

  // Summary section (optional)
  const summarySection = data.summary
    ? `\\cvsection{Professional Summary}
\\smallskip
\\begin{itemize}
\\item ${escapeLatex(data.summary)}
\\end{itemize}
`
    : '';
  main = main.replace(/{{SUMMARY_SECTION}}/g, summarySection);

  // Skills items
  const skillsItems = [];
  if (data.skills.languages?.length) {
    skillsItems.push(
      `\\item \\large{\\textbf{Programming Languages}}
  \\begin{itemize}
  \\smallskip
${data.skills.languages.map((lang) => `    \\item \\textbf{${escapeLatex(lang)}}`).join('\n')}
  \\end{itemize}
  \\smallskip`
    );
  }
  if (data.skills.technical?.length) {
    skillsItems.push(
      `  \\item \\large{\\textbf{Frameworks \\& Libraries}} 
  \\begin{itemize}
  \\smallskip
${data.skills.technical.map((tech) => `   \\item \\textbf{${escapeLatex(tech)}}`).join('\n')}
  \\end{itemize}
  \\smallskip`
    );
  }
  if (data.skills.tools?.length) {
    skillsItems.push(
      `  \\item \\large{\\textbf{Tools}}
  \\begin{itemize}
  \\smallskip
${data.skills.tools.map((tool) => `    \\item \\textbf{${escapeLatex(tool)}}`).join('\n')}
  \\end{itemize}`
    );
  }
  main = main.replace(/{{SKILLS_ITEMS}}/g, skillsItems.join('\n  \\smallskip\n  \\smallskip\n'));

  return {
    'altacv.cls': altacvCls,
    'page1sidebar.tex': sidebar,
    'mmayer.tex': main,
  };
}

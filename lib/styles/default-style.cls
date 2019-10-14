\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{lib/styles/default-style}[2019 LBoiler class]
 
\RequirePackage{silence}
\WarningFilter*{memoir}{You are using the caption package with the memoir class}

% main class
\LoadClass[a4paper]{report}

%%% font setup
\RequirePackage[14pt]{extsizes}
\RequirePackage[T1,T2A]{fontenc}
\RequirePackage[utf8]{inputenc}
\RequirePackage[english,russian,ukrainian]{babel}
% use tempora font
\RequirePackage{tempora}
\RequirePackage{indentfirst}
\RequirePackage{setspace,amsmath}
\RequirePackage{kantlipsum}
\RequirePackage[normalem]{ulem}
\RequirePackage[left=20mm, top=15mm, right=15mm, bottom=15mm, nohead, footskip=10mm]{geometry}
\RequirePackage{enumitem}
\RequirePackage{ragged2e}
\RequirePackage{calc}
\RequirePackage{multirow}
\RequirePackage{mwe}
\RequirePackage{soulutf8}
\setlist{leftmargin=15.5mm}

\setlength{\RaggedRightParfillskip}{.25\textwidth plus 1fil}
\setlength{\RaggedRightRightskip}{0pt plus .1\textwidth}
\setlength{\RaggedRightParindent}{1em}

% import utils libs
\RequirePackage{lib/importers/default-importer}
\RequirePackage{lib/macro/global}

\IfFileExists{lib/macro/user-info.sty}{\RequirePackage{lib/macro/user-info}}{}
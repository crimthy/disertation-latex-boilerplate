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
\RequirePackage{ulem}
\RequirePackage[left=20mm, top=15mm, right=15mm, bottom=15mm, nohead, footskip=10mm]{geometry}
\RequirePackage{enumitem}
\setlist{leftmargin=15.5mm}

% import utils libs
\RequirePackage{lib/importers/default-importer}
\RequirePackage{lib/macro/global}

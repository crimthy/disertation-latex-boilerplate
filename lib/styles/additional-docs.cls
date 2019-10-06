\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{lib/styles/additional-docs}[2019 LBoiler class]
 
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
\RequirePackage{setspace,amsmath}
\RequirePackage{kantlipsum}
\RequirePackage[left=20mm, top=10mm, right=10mm, bottom=20mm, nohead, footskip=10mm]{geometry}
\RequirePackage{enumitem}
\RequirePackage{ragged2e}
\RequirePackage{calc}
\RequirePackage{ulem}
\setlist{leftmargin=15.5mm}
\pagenumbering{gobble}

% import utils libs
\RequirePackage{lib/macro/global}
\RequirePackage{lib/utils}
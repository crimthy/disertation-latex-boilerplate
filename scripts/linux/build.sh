#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DELIM_COUNT="$(echo "${SCRIPT_DIR}" | awk -F"/" '{print NF-1}')"
COUNT=$(( DELIM_COUNT - 1 ))
BUILD_PATH="$(echo "$SCRIPT_DIR" | cut -d"/" -f1-${COUNT} )/build"
FORMAT=${1}
FILE_NAME=${2:-main.tex}
mkdir -p build && pdflatex -output-directory=$BUILD_PATH -output-format=pdf -synctex=1 -interaction=nonstopmode -shell-escape $FILE_NAME
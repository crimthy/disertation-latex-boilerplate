#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DELIM_COUNT="$(echo "${SCRIPT_DIR}" | awk -F"/" '{print NF-1}')"
COUNT=$(( DELIM_COUNT - 1 ))
FILE_NAME=${1:-main.pdf}
PDF_PATH="$(echo "$SCRIPT_DIR" | cut -d"/" -f1-${COUNT} )/build/${FILE_NAME}"
xdg-open $PDF_PATH
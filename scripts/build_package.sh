#!/bin/bash

set -e

echo "Going to project root folder"
cd "$(dirname "$0")/.."

if [ -f .env ]; then
  echo "Adding environment variables from .env file"
  set -o allexport
  source .env
  set +o allexport
fi

echo "Creating empty tmp folder"
rm -rf tmp
mkdir tmp

echo "Creating required files for manifest at tmp folder"
cp -r package/* tmp
perl -p -e 's/\$\{([^}]+)\}/defined $ENV{$1} ? $ENV{$1} : $&/eg' < tmp/manifest.template.json > tmp/manifest.json
rm tmp/manifest.template.json

echo "Creating zip file from tmp folder"
mkdir -p dist
cd tmp
zip ../dist/package.zip -r .
cd ..

echo "Cleaning tmp file"
rm -rf tmp

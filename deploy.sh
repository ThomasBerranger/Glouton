#!/usr/bin/env sh

# Arrêter en cas d'erreur
set -e

# Construction du projet
npm run build

# Aller dans le répertoire de build
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:ThomasBerranger/Glouton.git main:glouton-v2

cd -
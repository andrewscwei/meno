#!/bin/bash

set -e

source .circleci/get_opts.sh

# Publish docs to gh-pages branch.
echo "Publishing to gh-pages branch..."

if [ `git branch | grep gh-pages` ]
then
  git branch -D gh-pages
fi
git checkout -b gh-pages

cd demo
yarn
cd ..
npm run demo:build

# Move generated demo to root and delete everything else.
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name 'demo' ! -name '.git' ! -name '.gitignore' -exec rm -rf {} \;
mv demo/public/* .
rm -R demo/

# Push to gh-pages.
git config user.name "$CIRCLE_PROJECT_USERNAME"
git config user.email "$CIRCLE_PROJECT_USERNAME@users.noreply.github.com"
git add -fA
git commit --allow-empty -m "[Skip CI] $(git log -1 --pretty=%B)"
git push -f $GIT_ORIGIN_URL gh-pages

echo
echo -e "Successfuly deployed to GitHub pages"

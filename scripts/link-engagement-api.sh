#!/bin/sh

rm -rf `pwd`/node_modules/@livelike
source ~/.nvm/nvm.sh
nvm use v18.12.1
npm link @livelike/engagement-api --install-links
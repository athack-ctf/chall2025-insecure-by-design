#!/bin/bash

export USE_HEADLESS_MODE=true
export CHROME_ABS_PATH=/usr/bin/google-chrome

# Navigate to the desired directory
cd /chall/admin-bot

# Run the npm start command
npm run admin-bot

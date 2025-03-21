#!/bin/bash

# Starting cron (as root)
# Start cron in the background
cron

# Allow user to run cron jobs
echo "admin-bot" >> /etc/cron.allow

# De-escalating to user
# Set up the cron job to run every 2 minutes (add it to crontab)
su - admin-bot -c 'echo "*/2 * * * * env PATH=$PATH /chall/admin-bot/periodic-admin-bot.sh >> /tmp/cron.admin-bot.log 2>&1" | crontab -'

# Seed the database
su - inkhub -c 'cd /chall/inkhub && npm run seed-db'

# Start the web server in the foreground (to keep the container running)
su - inkhub -c 'cd /chall/inkhub && npm start'

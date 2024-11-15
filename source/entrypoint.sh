#!/bin/bash

# Starting cron (as root)
# Start cron in the background
cron

# Allow user to run cron jobs
echo "user" >> /etc/cron.allow

# De-escalating to user
# Set up the cron job to run every 2 minutes (add it to crontab)
su - user -c 'echo "* * * * * env PATH=$PATH /chall/admin-bot/periodic-admin-bot.sh >> /tmp/cron.admin-bot.log 2>&1" | crontab -'


# Seed the database
su - user -c 'cd /chall/inkhub && npm run seed-db'

# Start the web server in the foreground (to keep the container running)
su - user -c 'cd /chall/inkhub && npm start'

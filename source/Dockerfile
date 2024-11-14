FROM node:18-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Notes:
# - Except for the cron part, this line installs the necessary libs to make the browser work with Puppeteer.
# - Cron is needed for the admin-bot
RUN apt-get update && apt-get install curl gnupg cron -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Set working directory to /chall/
WORKDIR /chall/

# Using unpriviliged admin-bot
RUN useradd -m user
RUN chown -R user .
USER user

# Set working directory to /chall/admin-bot
WORKDIR /chall/admin-bot

# Copying admin-bot
COPY --chown=user:user admin-bot/ .

# Adding exec privs to periodic script
RUN chmod +x /chall/admin-bot/periodic-admin-bot.sh

# Installing admin-bot
RUN npm install --silent

# Set working directory to /chall/inkhub
WORKDIR /chall/inkhub

# Copying inkhub
COPY --chown=user:user inkhub/ .

# Installing inkhub
RUN npm install --silent

# Set working directory to /chall
WORKDIR /chall

# Copy the entrypoint script
COPY --chown=user:user entrypoint.sh .
RUN chmod +x ./entrypoint.sh

# Needed to start cron (de-escalation to 'user' happens in entrypoint.sh)
USER root

# Set entrypoint to custom script
ENTRYPOINT ["./entrypoint.sh"]

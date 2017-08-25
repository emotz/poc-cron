FROM node

RUN apt-get update && apt-get install -y cron

WORKDIR /src

COPY package.json .
RUN npm install

COPY crontab /etc/cron.d/hello-cron
RUN chmod 0644 /etc/cron.d/hello-cron
RUN touch /var/log/hello-cron.log

COPY script.sh /script.sh
RUN chmod +x /script.sh

COPY src src

CMD cron && tail -f /var/log/hello-cron.log

FROM node

RUN apt-get update && apt-get install -y cron

WORKDIR /src

COPY package.json .
RUN npm install

COPY crontab /etc/cron.d/updatedb-cron
RUN chmod 0644 /etc/cron.d/updatedb-cron
RUN ln -sf /proc/1/fd/1 /var/log/updatedb-cron.log

COPY script.sh /script.sh
RUN chmod +x /script.sh

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY src src

CMD /entrypoint.sh

#!/bin/bash

echo "#!/bin/bash" > /env.sh
echo export MYSQL_USER=$MYSQL_USER >> /env.sh
echo export MYSQL_PASSWORD=$MYSQL_PASSWORD >> /env.sh
echo export MYSQL_HOST=$MYSQL_HOST >> /env.sh
echo export MYSQL_DB=$MYSQL_DB >> /env.sh
chmod +x /env.sh

# Start cron
cron

# Script to keep the container alive
while : ; do
    sleep 3
    echo FROM keepalive script: `date`
done

#!/bin/bash

# Start cron
cron

# Script to keep the container alive
while : ; do
    sleep 3
    echo FROM keepalive script: `date`
done

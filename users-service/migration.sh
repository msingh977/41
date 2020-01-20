#!/bin/sh
/usr/src/app/wait-for-it.sh users-service-db:7201 -- npm run db:migrate
# npm run db:migrate
npm run watch
#!/bin/sh
/usr/src/app/wait-for-it.sh listing-service-db:7200 -- npm run db:migrate
# npm run db:migrate
npm run watch
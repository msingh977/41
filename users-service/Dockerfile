# base image
FROM node:latest

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json /usr/src/app/package.json
RUN npm install

# use of 'wait-for-it' to make sure the db is up and running
# before running the db:migration
# RUN git clone https://github.com/vishnubob/wait-for-it.git

# RUN sequelize init
# RUN npm run db:migrate

# add app
# ADD . /usr/src/app

# entrypoint for running migrations
# ADD wait-for-it.sh /usr/src/app/wait-for-it.sh
# RUN /usr/src/app/wait-for-it.sh users-service-db:7201 -- npm run db:migrate

# start app
CMD ["npm", "run", "watch"]
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
# RUN ["chmod", "+x", "/usr/src/app/wait-for-it.sh"]

# start app
ADD wait-for-it.sh /usr/src/app/wait-for-it.sh
ADD migration.sh /usr/src/app/migration.sh
RUN ["chmod", "+x", "migration.sh"]
RUN ["chmod", "+x", "wait-for-it.sh"]
CMD ["npm", "run", "watch"]
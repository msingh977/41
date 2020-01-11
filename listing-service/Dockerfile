# base image
FROM node:latest

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json /usr/src/app/package.json
RUN npm install

# RUN npm run db:migrate

# add app
# ADD . /usr/src/app

# start app
CMD ["npm", "run", "watch"]
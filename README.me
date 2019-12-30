### Step 1

- initialize the project by:
```sh
# in the folder directory
npm init -y
```
this will creat the package.json file

add the folowing modules:
- babel-watch (development)
- @babel\core
- @babel\polyfill
- @babel\preset-env
- babel-plugin-module-resolver

```sh
npm install -D babel-watch
npm install @babel\core @babel\polyfill @babel\preset-env babel-plugin-module-resolver
```

- Add 'babel.config.js' file to the folder to specify the relevant presets and targets:

```sh
module.exports = {
  plugins: [['module-resolver', { alias: { '#root': './src' } }]],
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
}
```

- add a new ```script``` section to the ```package.json``` file:
```
"scripts": {
    "watch": "babel-watch -L src/index.js"
  },
```

- create a new file ```src\index.js``` and add:
``` 
import path from 'path'
console.log('listing-service is working')
```

- open a new terminal in the folder and run:
```sh
yarn watch
```

if all setup correctly then ```listing-service is working``` should appear on the console.

### Step 2
As we want to create differnt micro-services for each of the portions of the app, we will create the ```Dockerfile``` that will have the setup for the service.

- create a new ```Dockerfile``` in the folder and add the following:
```sh
FROM node:12

COPY . /opt/app

WORKDIR /opt/app

RUN yarn

CMD yarn watch
```

- ```FROM node:12``` will grab the latest node:12 build from ```hub.docker.com```. This will save time in the container build.
- ```COPY . /opt/app``` will copy all the files from the current folder into the container and will place it in the '/opt/app' folder.
- ```WORKDIR /opt/app``` will setup the working directory in the container for the rest of the commands in the file
-```RUN yarn``` will run yarn only once during the build. it will not run it again, unless we will re-build the container.
- ```CMD yarn watch``` this will initiate the ```watch``` module and will watch for any chanes in the ```index.js``` file, and then restart the server to take in effect the changes.


- in the ```terminal``` windowl run the follwing to build the container:
```sh
docker build .
```

now we have a container that includes all the necessary files from the folder.

### Step 3
As the ```Users``` service has the same basis as the ```listing``` service, let's copy the content of the folder to the ```'users-service'``` folder and make the necessary chages in the files.

- open a new ```terminal``` and move to the 'user-service' folder.
- run ```yarn``` to update and refresh the ```yarn.lock``` file.
- run ```docker build .``` to create a new container for the 'user-service'

### step 4
As we would like to control the option of running the services and have them connected and have the ability to transfer data between them, we will use ```docker-compose``` file that will allow us to do so.

- in the ```root``` folder of the project, create a new file ```docker-compose.yml``` and add the following content:
```sh
version: "3"
services:
  listing-service:
    build: "./listing-service"
    depends_on:
     - listing-service-db
    volumes:
     - ./listing-service:/opt/app

  listing-service-db:
    environment:
     - MYSQL_ROOT_PASSWORD=password
     - MYSQL_DATABASE=db
    image: mysql:5.7.20    

  users-service:
    build: "./users-service"
    depends_on:
     - users-service-db
    volumes:
     - ./users-service:/opt/app

  users-service-db:
    environment:
     - MYSQL_ROOT_PASSWORD=password
     - MYSQL_DATABASE=db
    image: mysql:5.7.20        
```     
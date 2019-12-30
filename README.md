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

- add a new `script` section to the `package.json` file:
```
"scripts": {
    "watch": "babel-watch -L src/index.js"
  },
```

- create a new file `src\index.js` and add:
``` 
import path from 'path'
console.log('listing-service is working')
```

- open a new terminal in the folder and run:
```sh
yarn watch
```

if all setup correctly then `listing-service is working` should appear on the console.

### Step 2
As we want to create differnt micro-services for each of the portions of the app, we will create the `Dockerfile` that will have the setup for the service.

- create a new `Dockerfile` in the folder and add the following:
```sh
FROM node:12

COPY . /opt/app

WORKDIR /opt/app

RUN yarn

CMD yarn watch
```

- `FROM node:12` will grab the latest node:12 build from `hub.docker.com`. This will save time in the container build.
- `COPY . /opt/app` will copy all the files from the current folder into the container and will place it in the '/opt/app' folder.
- `WORKDIR /opt/app` will setup the working directory in the container for the rest of the commands in the file
-`RUN yarn` will run yarn only once during the build. it will not run it again, unless we will re-build the container.
- `CMD yarn watch` this will initiate the `watch` module and will watch for any chanes in the `index.js` file, and then restart the server to take in effect the changes.


- in the `terminal` windowl run the follwing to build the container:
```sh
docker build .
```

now we have a container that includes all the necessary files from the folder.

### Step 3
As the `Users` service has the same basis as the `listing` service, let's copy the content of the folder to the `'users-service'` folder and make the necessary chages in the files.

- open a new `terminal` and move to the 'user-service' folder.
- run `yarn` to update and refresh the `yarn.lock` file.
- run `docker build .` to create a new container for the 'user-service'

### step 4
As we would like to control the option of running the services and have them connected and have the ability to transfer data between them, we will use `docker-compose` file that will allow us to do so.

- in the `root` folder of the project, create a new file `docker-compose.yml` and add the following content:
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
- open a new terminal in the `root` folder of the project and run:
```sh
docker-compose up
```
  this will start all the services including setting up the db.

###  Step 5
As currently the db are not accessible to the outside world, let's add ability to access them.
This is done for testing purposes, as eventually these db will need to be accessed by the API applications only should not have external acccess.

- open the `docker-compose.yml` file and add the following to the `listing-service` section:
```sh
listing-service:
....
  image:mysql:5.7.20
  ports:
  - 0.0.0.0:7200:3306
```
, then add the same to the `users-service` section, but with `7201` as the port:
```sh
   ports:
  - 0.0.0.0:7201:3306
```  
- stop the services, by clicking CRTL+C in the `terminal` window where we are running them.
- restart the servicesm by running `docker-compose up`. This will expose the new ports.
- test the connection to the db by using a SQL manager app (like MySQLWorkbench by Oracle). connecting to the two dbs, using `localhost:7200` and `localhost:7201`, as their connection location, will show that there are no tables in either.

### Step 6
We will now add some content to the db.
We will start with the `listing-service-db`.
- open a new `terminal` window and go to the `listing-service` folder.
- we are adding the `mysql2 sequelize` and `sequelize-cli` by running:
```sh
yarn add mysql2 sequelize sequelize-cli
```
- `sequelize` is an excellent ORM that will allow us to manage the connection, models and the rest of the activities agains the db.

- next we wll create the sequelize configuration file, by creating a new file `.sequelizerc` in the `listing-service` folder.
- add the following in the file:
```sh
const path = require("path");

module.exports = {
  config: path.resolve(__dirname, "./sequelize/config.js"),
  "migrations-path": path.resolve(__dirname, "./sequelize/migrations.js")
};
```
- now we can add the two files that we have specified in hte `rc` file:
`sequelize\config.js` and `sequelize\migrations.js`.
- add the follwing to the `config.js` file:
```sh
module.exports.development = {
    dialect: "mysql",
    seederStorage: "sequelize",
    url: process.env.DB_URI
  };
```
  as we are specifying the DB_URI env variable, we need to add it to the `docker-compose.yml` file, so it can be used.
- in the `listing-service` section, below the `depends_on` add:
```sh
  environment: 
   - DB_URL=mysql://root:password@listing-servcie-db/db?charset=UTF8
```
  the `listing-service-db` is the name of the db serivce within the Docker services. We do not need to specify the ip address of the db, only its name, Docker will resolve it as needed.
  `UTF8` as the charset will allow to use most of the characters as well as emoji if needed.

 - add a new folder `migrations` in the `sequelize` folder. This will hold all the migrations, changes to the db structure, that we would like to make during the project build-up.
 - create a new file in the `migrations` folder. As we would like to keep track over the changes that we are making to the db, name the file with the date, time and the table that you are making the changes to. Add a file `201912301049-create-listings.js`.
- add the folllwing to the file to create the `listings` table in the db:
```sh
module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable(
    'listings',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      charset: 'utf8'
    }
  )
}
```
- now that we have the migration setup, we need somehow have it executed on the db. The way to do that is by adding a script to the `package.json` file.
- add the following lines to the `script` section in the `package.json` file:
```sh
 "db:migrate":"sequelize db:migrate",
 "db:migrate:undo":"sequelize db:migrate:undo",
```
the first will run all the migrations that were not done, and the second will undo all the migrations that were done.
- we need to run these migrations within the Docker container for the service. To "enter" in the container do the following:
  - opena new `terminal` window and using the `docker ps` command list all the running docker containers.
  - identify the one that is related to the `listing-service` and copy its `CONTAINER ID`.
  - at the command prompt type `docker exec -it xxxx bash`. 'xxxx' is the first 4 characters of the container ID. This will start the terminal bash inside the container.
  - then in the container, we can see the mounted volume from the hosting computer 'listing-service'. Then run `yarn db:migrate` to execute the migrations:
  ```sh
Loaded configuration file "sequelize/config.js".
Using environment "development".
== 201912301049-create-listings: migrating =======
== 201912301049-create-listings: migrated (0.042s)
```
- now we can check the MySQL Manager to view the changes in the db.


### Step 7


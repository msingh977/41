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

module.exports.down = queryInterface => queryInterface.dropTable('listings');
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
- the idea for this setup of services that we are doing, is to allow to control each of the services as an independent service. This will allow us to expand the resources for each of the services independently if needed based on the number of users, queries or any other stress that these services will go under.

- As we have  `users-service` to setup, then copy the `.sequelizerc` from `src` folder in the `listing-service` to the same folder in the `users-service\src` folder. The setup for `sequelize` is the same for both services.
- copy the `sequelize` folder from the `listing-service` to the `users-service`. We will need to make changes as follows:
  - add the same modules as we added earlier:
    ```sh
    yarn add mysql2 sequelize sequelize-cli
    ```
  - add the scripts that we added to the `package.json` file to take care of the migrations, to the `users-service` `package.json` file:
    ```sh
    "db:migrate":"sequelize db:migrate",
    "db:migrate:undo":"sequelize db:migrate:undo",
    ```
  - remove the `listing` migrations files from the `migrations` folder, and create a new one of the `users` table migrations. The file name should inlucde the current date, time and name of the table that we are migrating to the db. Add the following to the file:
      ```sh
      module.exports.up = (queryInterface, DataTypes) => {
      return queryInterface.createTable(
        'users',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
          },
          email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
          },
          passwordHash: {
            allowNull: false,
            type: DataTypes.CHAR(64)
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
    module.exports.down = queryInterface => queryInterface.dropTable('users');
    ```
    We are using UUID as data type for the `id` field, instead of `autoincrement`. This will "hide" the number of users in the db. The UUID is a 'random' number that can be used an ID but does not discloses any additional information over the record it represens.

    - now create a new migration file that will create the `userSessions` table and add the following:
    ```sh
      module.exports.up = (queryInterface, DataTypes) => {
      return queryInterface.createTable(
        'userSessions',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
          },
          userId: {
            allowNull: false,
            reference: {
              key: 'id',
              model: 'users'
            },
            type: DataTypes.UUID
          },
          expiresAt: {
            allowNull: false,
            type: DataTypes.DATE
          },

          createdAt: {
            allowNull: false,
            type: DataTypes.DATE
          }
        },
        {
          charset: 'utf8'
        }
      )};

      module.exports.down = queryInterface => queryInterface.dropTable('usersSessions'); 
    ```
    - next we need to migrate the changes to the `users-service`.
    - open a new `terminal` window, find the `users-service` running container in using the `docker ps` command and then run `docker exec -it xxxx bash`, where xxxx is the first four characters of the container.
    - when in the container, run `yarn db:migrate` at the command, to execute the migrations for the `users-service`. The following results should appear on the terminal:
    ```sh
      Loaded configuration file "sequelize/config.js".
      Using environment "development".
      == 201912301449-create-users: migrating =======
      == 201912301449-create-users: migrated (0.051s)

      == 201912301501-create-userSessions: migrating =======
      == 201912301501-create-userSessions: migrated (0.020s) 
    ```
    - check the tables that were created using the MySQL Manager app.

### Step 8
- next we will add the necessary to serve the api from the db.
- in the `users-service` folder run the following:
```yarn add express cors body-parser```
  this will add additional modules to the project.
- open the  `index.js` file in the `users-service\src\` folder, remove the content (that shows that the service is working), and replace it with:
```
import "@babel/polyfill";

import "#root/db/connection";
import "#root/server/startServer";
```
and add the files that were referenced in the script: `db\connections.js` and `server\startServer.js`  
- in the `connection.js` file add the following:
```sh
import { Sequelize } from 'sequelize'

import accessEnv from '#root/helpers/accessEnv'

const DB_URI = accessEnv('DB_URI')

const sequelize = new Sequelize(DB_URI, {
  dialectOptions: {
    charset: 'utf8',
    nultipleStatements: true
  },
  logging: false
})

export default sequelize
```
this will set the connection to the db based on the env variable `DB_URI`. In order to read the environemnt variable we will setup a "helper" file that will read the variables and will cache them for future use (as long as the application and the server is running). As reading these env variables has a toll on the performacne of the application, we will cache those that we are reading, for future use in the application.

- set a new file `accessEnv.js` in the `helpers` folder, and add the following to it:
```sh
  // Access variables inside process.env, throwing an error if it's not found.
  // always run this methos in adnace (i.e. upon initialization) so that the error is
  // thrown as early as possible.
  // caching the values improces performace - access process.env many times is bad and
  // have a taxi on the performace of the application

  const cache = {}

  const accessEnv = (key, defaultValue) => {
    if (!(key in process.env)) {
      if (defaultValue) return defaultValue
      throw new Error(`$(key) not found in process.env`)
    }

    if (cache[key]) return cache[key]

    cache[key] = process.env[key]

    return process.env[key]
  }

  export default accessEnv
```

- next, we setup the server and we will start it using express. Opent he file `startServer.js` in the `server` folder, and add the following:
```sh
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

import accessEnv from '#root/helper/accessEnv'

const PORT = accessEnv("PORT", 7100)

const app = express()

app.use(bodyParser.json())

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true
  })
)

app.listen(PORT, "0.0.0.0", () => {
  console.info(`Listing Service listening on ${PORT}`)
})
```
this is the setup of `listing-service` server. It will read the `PORT` env variable, and will default it to 7100 if it will not exists. Then it will add the `body-parser` and `cors` middleware, to allow reading the params from the requests (body-parser) and restricrt 'cross origin access' (cors). Once the server will start it will send a notification to the console with indication to the `PORT` it is listening on:
``` listing-service_1     | Listing Service listening on 7100 ```

- now that we have the port of the service, we can "expose" on the `docker-compose.yml` file by adding the secrion `ports:` to the `listing-service` section:
```sh
envrionment:
 ...
ports:
  - 7100:7100
```

- we then set the `users-service` to listen to port 7101:
  - copy the folders `db`, `helpers` and `server` from the `listing-service\src` folder to the `users-service\src` folder and make the following chagnes.
  - in the `startServer.js` change the default port from 7100 to 7101:
  ```sh
    const PORT = accessEnv('PORT', 7101)
  ```
  - and, change the notification to the console to be:
  ```sh
    app.listen(PORT, '0.0.0.0', () => {
      console.info(`Users Service listening on ${PORT}`)
    })
  ```
  - copy the `index.js` from the `listing-service\src` folder to `users-service\src` folder. Once that is done, the service will restart and the console should have the following notification:
  ```sh
    users-service_1       | Users Service listening on 7101
  ```

- open a browser and go to `http://localhost:7100`. This is the entry point to the `listing-service` server. The result should be: **`Cannot GET /`**.
  as we have not yet defined any routes, not even to the default one, the results from the server is that there is no access.
- the same is for `http://localhost:7101`.

### Step 9
now that we have setup the two server, let's add some routes.

- create a new file `routes.js` in the `listing-service\server` folder. This will have the definitions of the server routes. Add the following to the file:
```sh
const setupRoutes = app => {
  \\
}

export default setupRoutes;
```

- in the `startServer.js` file, we need to import the routes definiton and the apply it to the express application:
```
...
import accessEnv...

import setupRoutes from './routes'
...
app.use(cors 
  ...
)

setupRoutes(app);
...
```

- now let's add the routes definitions. As a start add the following to the `listing-service\src
server\routes.js` file:
```sh
const setupRoutes = app => {
  app.get('/listings', (req,res,next) =>{
    return res.json({message:"here are the listings"})
  })
}

export default setupRoutes;
```
- wait for the server to restart, and point the browser to `http://localhost:7100/listing`. The response should be a JSON message: `{message:'here are the listings'}`.

- now, let's add some data from the db itself. In order to do so, we need to define the model of the record that we will fetch from the db. This is done by the `model` definition form the `Sequelize` module.
- in the `db` folder create a new file `models.js` and add the following:
```sh
import { DataTypes, Model } from 'sequelize'

import sequelize from './connections'

export class Listing extends Model{}
Listing.init(
    {
        title:{
            allowNull: false,
            type: DataTypes.STRING
        },
        description: {
            allowNull: false,
            type: DataTypes.TEXT
        }
    },
    {
        modelName: "listings",
        sequelize
    }
)
```
the model definitoin also binds the model to the db connection:
``` 
    modelName:"listings",
    sequelize
```

- now, add the new model definition to the `routes` file by adding:
```
  import { Listing } from '#root/db/models'`
```
and then change the definition of the `/listings` route to:
```
  app.get('/listings', async (req, res, next) => {
    const listings = await Listing.findAll()
    return res.json(listings)
  })
```
this will fetch all the records form the `listings` table and will return them in a JSON format to the user. As we have not records in the db, the returen result is an empty array, and on the browser it should appear as `[]`.

- using the MySQL manager, add a record to the `listings` table in the `listings-service-db`, and then refresh the browser to get the results from the db.

### Step 10
The listing and the users db are not supposed to be accessed directly, we need to build the API Gateway that will have access to these backend dbs.

- in the `api-gateway` folder initiate a new project by running `yarn init -y`. This will create a new `package.json` file.
- add some dependencies:
  - babel-watch for the development: `yarn add -D babel-watch`
  - and some other ones: `yarn add @babel/core @babel/polyfill @babel/preset-env`
- we will be using graphQL as our main engine for the API, and we will use Apollo as our solution for that. Add the following depedencies as well: `yarn add apollo-server apollo-server-express babel-plugin-resolver cookie-parser cors express`

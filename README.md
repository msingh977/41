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

```javascript
module.exports = {
  plugins: [['module-resolver', { alias: { '#root': './src' } }]],
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
}
```

- add a new `script` section to the `package.json` file:
```json
"scripts": {
    "watch": "babel-watch -L src/index.js"
  },
```

- create a new file `src\index.js` and add:
```javascript 
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
```yml
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
```yml
listing-service:
....
  image:mysql:5.7.20
  ports:
  - 0.0.0.0:7200:3306
```
, then add the same to the `users-service` section, but with `7201` as the port:
```yml
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
```javascript
const path = require("path");

module.exports = {
  config: path.resolve(__dirname, "./sequelize/config.js"),
  "migrations-path": path.resolve(__dirname, "./sequelize/migrations.js")
};
```
- now we can add the two files that we have specified in hte `rc` file:
`sequelize\config.js` and `sequelize\migrations.js`.
- add the follwing to the `config.js` file:
```javascript
module.exports.development = {
    dialect: "mysql",
    seederStorage: "sequelize",
    url: process.env.DB_URI
  };
```
  as we are specifying the DB_URI env variable, we need to add it to the `docker-compose.yml` file, so it can be used.
- in the `listing-service` section, below the `depends_on` add:
```yml
  environment: 
   - DB_URL=mysql://root:password@listing-servcie-db/db?charset=UTF8
```
  the `listing-service-db` is the name of the db serivce within the Docker services. We do not need to specify the ip address of the db, only its name, Docker will resolve it as needed.
  `UTF8` as the charset will allow to use most of the characters as well as emoji if needed.

 - add a new folder `migrations` in the `sequelize` folder. This will hold all the migrations, changes to the db structure, that we would like to make during the project build-up.
 - create a new file in the `migrations` folder. As we would like to keep track over the changes that we are making to the db, name the file with the date, time and the table that you are making the changes to. Add a file `201912301049-create-listings.js`.
- add the folllwing to the file to create the `listings` table in the db:
```javascript
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
      ```javascript
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
    ```javascript
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
```javascript
import "@babel/polyfill";

import "#root/db/connection";
import "#root/server/startServer";
```
and add the files that were referenced in the script: `db\connections.js` and `server\startServer.js`  
- in the `connection.js` file add the following:
```javascript
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
```javascript
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
```javascript
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
```yml
envrionment:
 ...
ports:
  - 7100:7100
```

- we then set the `users-service` to listen to port 7101:
  - copy the folders `db`, `helpers` and `server` from the `listing-service\src` folder to the `users-service\src` folder and make the following chagnes.
  - in the `startServer.js` change the default port from 7100 to 7101:
  ```javascript
    const PORT = accessEnv('PORT', 7101)
  ```
  - and, change the notification to the console to be:
  ```javascript
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
```javascript
const setupRoutes = app => {
  \\
}

export default setupRoutes;
```

- in the `startServer.js` file, we need to import the routes definiton and the apply it to the express application:
```javascript
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
```javascript
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
```javascript
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
```javascript
    modelName:"listings",
    sequelize
```

- now, add the new model definition to the `routes` file by adding:
```javascript
  import { Listing } from '#root/db/models'`
```
and then change the definition of the `/listings` route to:
```javascript
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
  - babel-watch for the development: 
  ```sh
    yarn add -D babel-watch
  ```
  - and some other ones:
  ```sh
    yarn add @babel/core @babel/polyfill @babel/preset-env
  ```  
- we will be using graphQL as our main engine for the API, and we will use Apollo as our solution for that. Add the following depedencies as well:
```sh
yarn add apollo-server apollo-server-express babel-plugin-resolver cookie-parser cors express
```
- copy the file `babel.config.js` from the `listing-service` folder to `api-gateway` folder. It should have the same configuration.
- copy the `Dockerfile` from the `listing-service` folder to to `api-gateway` folder. We are basing the gateway on the same `node` engine.
- in the `package.json` file add:
```json
  "scripts": {
    "watch": "babel-watch -L src/index.js"
  },
```
to watch for the changes in the project and re-start the server as needed.

- create a new `index.js` file in the `root` of the `api-gateway` folder and add the following:
```javascript
console.log('API Gateway is working')
```

- in the main `docker-compose.yml` file we need to add a section to start the new service. Add a new section with the following content:
```yml
  api-gateway:
    build: "./api-gateway"
    depends_on:
      - listing-service
      - users-service
    ports:
      - 7000:7000
    volumes:
      - ./api-gateway:/opt/app
```
the `api-gatway` depends on the `listing-service` and `users-gateway`, and not on the db. We also changed the port that willl be used for the gateway.    

- in the `terminal` window that have the `docker-compose up` running, click `CTRL+C` to stop the services, and then run `docker-compose up` again in order build the new service and start the other ones. The `terminal` window should show at some point:
```sh
api-gateway_1         | yarn run v1.21.1
api-gateway_1         | $ babel-watch -L src/index.js
api-gateway_1         | API Gateway is working
```

### Step 11
Now we can start building the `api-gateway` service.
- change the context of `index.js` file to:
```javascript
import "@babel/polyfill"

import "#root/server/startServer"
```
as we don't have a database for this service, we do not need to include any connection to it.
- create a new folder `server`, and a new file `startServer.js`. Add the following to the file:
```javascript
import { ApolloServer } from 'apollo--server-express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import accessEnv rom '#root/helpers/accessEnv'

const PORT = accessEnv("PORT",7000);
```
copy the folder `helpers` from the `listing-service` folder to the `api-gateway` folder. We are using the same helpers and the same `accessEnv` file from the other services. We are keeping a "local" copy of the folder and file, as this will allow us to separate the services to different locations as we need to.
We alos defaulting the port of the `api-gateway` to 7000, if the PORT is not defined in the project environment variables.

- As we are using graphQL as the engine to query the db, we need to add some definitions that are related to it.
  In the `src` folder create a new one `graphql` and a new file `typeDefs.js` in it. This will hold the type definitions:
  ```javascript
  import { gql } from 'apollo-server'

  const typeDefs = gql`
    type Listing {
      description: String!
      id: ID!
      title: String!
    }

    type Query {
      listings: [Listing!]!
    }
  `
    export default typeDefs
  ```
  The type definitions are the defintions that the graphQL engine will allow:
  -  `type Listing` defines the fields and their formats that can be queried from the `Listing` table.
  -  `type Query` defines the query results that are allowed. In this case it is non-null array of non-null Listing.

- Now we need to define the resolvers for the queries. In the `graphql` folder create a new folder `resolvers` and in it a file `index.js`. Add the folllowing to it:
```javascript
import * as Query from './Query'

const resolvers = { Query }

export default resolvers
```
- creeste a new file `Query/index.js` in the `graphql` folder:
```javascript
export { default as listings } from "./listings";
```
- in the `Query` folder, create a new file 'listings.js'. This will hold the resolvers for the listings queries. For now let's return mock data to test the settings:
```javascript
const listingsResolver = async () => {
  return [
    {
      id:1,
      description: "test",
      title: "test title",
    }
  ]
}

export default listingsResolver
```
- now that we have defined the typeDefs and the resolvers, let finish setting the server and start the graphQL service.
- in the `startServer.js` file add the following:
```javascript
...
import express from 'express'

import resolvers from '#root/graphql/resolvers'
import typeDefs from '#root/graphql/typeDefs'
...
const PORT....
cosnt apolloServer = new ApolloServer({
  resolvers,
  typeDefs
})

const app = express()
app.use(cookieParser())
app.use(
  cors({
    origin: (origin, cb) => cb(null,true),
    credentials: true
  })
)
apolloServer.applyMiddleware({ app, cors: false, path:"/graphql" })
app.listen(PORT, "0.0.0.0", () => {
  console.info(`API gateway listening on port ${PORT}`)
})
```
once you save the `startServer.js` file, the service should restart, and if all goes well you should get the following in the `terminal`:
```sh
api-gateway_1         | >>> RESTARTING <<<
api-gateway_1         | API gateway listening on port 7000
```

- now let's check if the service is running correctly. Open `http://localhost:7000` in a new browser window, and this should return the following:
```sh
Cannot GET /
```
as we have not defined the route '/'. Change the url on the browser to `http://localhost:7000/graphql`. This should open the graphQL playground interface on the screen. This will alllow us to run queries in graphQL against the API.
- on the left side of the graphQL playgound enter the following:
```graphql
query{
  listings{
    id
    title
    description
  }
}
```
then press the `PLAY` button in the middle of the screen. The following is the result from the API that will be displayed on the right side of the graphQL playground:
```JSON
{
  "data": {
    "listings": [
      {
        "id": "1",
        "title": "test title",
        "description": "test"
      }
    ]
  }
}
```
we now have the api-gateway working with graphql. The results are the mock data that we have setup to return. Now we need to setup the results to pull the information from db.

### Step 12
- we not connect the `listings` resolver to the db to pull the data from there. We create an adapater that will be acting as a connector between the db and the resolver.
- add `got` to the `api-gatway` by running `yarn add got` at the terminal windows opened in the `api-gateway` folder.
- create a new file `src/adapaters/listingService.js` and add the following:
```javascript
import got from 'got'

const LISTINGS_SERVICE_URI = 'http://listing-service:7100'

export default class ListingService {
  static async fetchAllListings () {
    const body = await got.get(`${LISTINGS_SERVICE_URI}/listings`).json()
    return body
  }
}
```
As we are using Docker we do not need to specify the IP address of the listing-service, but rather can use the service name and it will be resolved as needed.
</br>
We define the `fetchAllListings()` resolver that will fetch all the results from the `listing-service\listings` route, as we have defined it earlier. The results will be retruned back to the client in JSON format.
- replace the content of the filw `src\graphql\resolvers\Query\listings.js` with the following:
```javascript
import ListingsService from '#root/adapters/ListingsService'

const listingsResolver = async () => {
  return await ListingsService.fetchAllListings()
}

export default listingsResolver
```
- Now try to refresh the query on the graphQL playground. This should fetch all the records from the `listings` table in the `listing-db`:
```JSON
{
  "data": {
    "listings": [
      {
        "id": "1",
        "title": "test",
        "description": "test description"
      }
    ]
  }
}
```

### Step 13
Now we will add resolved to the `users-service`.
- add a new file `routes.js` in the `users-service\src\server` folder, and add the following:
```javascript
const setupRoutes = app => {
  ///
}

export default setupRoutes
```
now import the `routes` in the `startServer.js` file as follows:
```javascript
...
import accessEnv from '#roor/helpers/accessEnv'

import setupRoutes from './routes'
...
setupRoutes(app);

app.listen(PORT, ......
```
- the first route we will create will be to create a new user. In the `db` folder add a new file `models.js` and add:
```javascript
import { DataTypes, Model } from 'sequelize'

import sequelize from './connections'

export class User extends Model {}
User.init(
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
    }
  },
  {
    defaultScope: {
      rawAttribues: { excude: ['passwordHash'] }
    },
    modelName: 'users',
    sequelize
  }
)

export class UserSession extends Model {}
UserSession.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    userId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'users'
      },
      type: DataTypes.UUID
    },
    expiresAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    modelName: 'userSessions',
    paranoid: false,
    sequelize,
    updatedAt: false
  }
)
```
  - first we setup the `users` model. Basically this defines the fields that can be fetched by the API from the table in the db. As we do not want the users to extract password related infomration, as they need to be secured, we have included `rawAttribues: { excude: ['passwordHash'] }` in the `dataScope`.
  - we also defined the `userSessions` model, that is also based on the related table in the db. As we have not define `deletedAt` field in the db table, and in order to prevent a quesion of "permanently delete", we include `paranoid: false` in the model binding section. This will suppress these questions.
- next we need to add these models to the `routes.js` created in the `server` folder. In the `routes.js` file let's add:
```javascript
import { User } from '#root/db/models'

const setupRoutes = app => {
  app.post("/users", async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return next(new Error("Invalid body"))
    }

    try {
      const newUser = await User.create({
        email: req.body.eamil,
        id: generateUUID(),
        passwordHash: hashPassword(req.body.password)
      })
    }
  })
}
```
  - we specified two functions `generateUUID()` and `hashPassword()`. We need to define them as such:
  - in the `helpers` folder create a new file `generateUUID.js`.
  - in the `terminal` window, go to the `users-service` folder and run `yarn add uuid`. This will add the relevant module to support UUID.
  - the in the `generateUUID.js` file add the followins:
  ```javascript
    import uuidv4 from 'uuid/v4'
    const generateUUID = () => uuidv4();

    export default generateUUID
  ```
  this will generate the UUID and export it as a result.
  - now, create `hashPassword.js` in the `helpers` folder.
  - in the `terminal` window run `yard add bcryptjs`. This will add the `bcryptjs` dunctunality to allow hashing and comparing hashed passwors.
  - now, in the `hashPassword.js` file add the following:
  ```javascript
  import bcrypt from 'bcryptjs'

  const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

  export default hashPassword
  ```
  - now that we have these two helpers, let's add them to the `routes.js` file:
  ```javascript
    import generateUUID from  '#root/helpers/generateUUID'
    import hashPasswrod from  '#root/helpers/hashPassword'
  ```
  and then add the return function once the user is created:
  ```javascript
  retrun res.json(newUser)
  } catch (e) {
    return next(e)
  }
  ```
  - In this case of creating a new user there can be several error that may occur: no email, no password, and there can be some other errors that are coming from the db or `users-service` api. In case that it is realted to the email or password we return an error to the client with a message. In the other cases we just capture the message and pass it along to the next step. We need somehow to present it to the user.
  - in the `startServer.js` file let's add another section that will take care of these errors. The section is the last "middleware" that will be used:
  ```javascript
  ...
  setRoutes(app)

  app.use((err, req, res, next) =>{
    return res.status(500).json({
      message: err.message
    })
  })
  ```
- in order to test the user create route, we are going to use the *Postman* application, as it handles better POST type of requests than using a browser.
- Open the *Postman* application, change the type to POST, enter the url as the `user-service` url: `http://localhost:7101/users`. Now can start testing the route:
  - as our route expect email and password information, let's start by trying to send none of them. The response should be:
    ```JSON
      {
      "message": "Invalid body"
      }
    ```
  - next, let's test sending only email information. In the *Postman* app, select the `body` tab, select `raw` and *JSON* as the type. Enter:
    ```JSON
      { 
        "email":"test@example.com"
      }
    ```
    send the request, and the results should also be:
    ```JSON
      {
        "message": "Invalid body"
      }
    ```
  - the same error should be returned, if we send `password` only information. Both fields data should be included.
  - now, send the following body:
    ```JSON
      { 
        "email":"test@example.com",
        "password": "test"
      }
    ```
    we should receive a response like:
    ```JSON
      {
        "id": "0e839bd8-e055-42ca-97dc-61a4249454d1",
        "email": "test@example.com",
        "passwordHash": "$2a$12$pofwL93E//Mqn62NjgEvbueEkBE2Y5CubKGVvtwW5GIsZ3foZYD4O",
        "createdAt": "2020-01-03T01:46:45.000Z",
        "updatedAt": "2020-01-03T01:46:45.000Z"
      }
    ```
    it is OK to send back the hashed password here, as the user does not have any access to this route. He will have access to the results from the `api-gateway`, and there it will not be published.
- let's add the ability to create a new user in the `api-gateway`. in the `api-gateware\src\graphql\typeDefs.js` file add the following:
  ```graphQL
    type User {
      email: String!
      id: ID!
    }

    type Mutation {
      createUser ( email: String!, password: String!) : User!
    }
  ```
  that definition of graphQL types allows us to specify the fields that we allow to query on and return from the db. As we are not defining the hashed password in the *User* type, there is no way that the user will be able to retreive it from the db.
- now we need to add the ability for creating a user to the resolvers. Create a new file `Mutation/index.js` and add the following:
  ```javascript
  export { default as createUser } from './createUser'
  ```
- in the `api-gateware\src\graphql\index.js` import the new Mutation file:
  ```javascript
  import * as Mutation from './Mutation'
  ...
  const resolvers = { Mutation, Query }
  ```
- before creating the `createUser` resolved, we need to create the adapter for the `user-service`. To do so, create a new file `api-gateway\src\adapters\usersService.js`. In the file add the following:
  ```javascript
    import got from 'got'

    const USERS_SERVICE_URI = 'http://listing-service:7101'

    export default class UsersService {
      static async createuser({ email, password }) {
        const body = await got
        .post(`${USERS_SERVICE_URI}/newuser`, {
          json: { email, password }
        })
        .json()
        return body
      }
    }
  ```
- now that we have set the adapter to the service, let's create the createUser Mutation. Create a file `api-gateware\src\graphql\Mutation\createUser.js` and add the following:
  ```javascript
    import UsersService from '#root/adapters/UsersService'

    const createUserResolver = async (obj, { email, password }) => {
      return await UsersService.createUser({ email, password })
    }

    export default createUserResolver
  ```
  this will create a new user using the relevant route in the `users-service` api. We are using `{email, password}` parameters as an object, instread of using the parameters, as it will help in the future incase that we will need to pass additional parameters. This way we do not need to specify the correct order of the parameters.
- save the cahnges, and wait for the server to restart. Open the graphQL playground window, refresh it, and type in the left window:
 ```graphQL
    mutation{
      createUser(email: "test5@example.com", password:"test"){
        id
        email
      }
    }
```
click on the `PLAY` button and the result should be a new user created with the data from the db as follows:
```JSON
  {
    "data": {
      "createUser": {
        "id": "3007992f-3199-4413-ad9a-43ff6a396966",
        "email": "test5@example.com"
      }
    }
  }
```
This is the response from the `users-service` api with the data received from the db and exposed back to the user. As you can see it does not includes the hashed password, as it is not a field that is available to be retreived.

### Step 14
In the last step we created a route to create a new user. If we will try to create a user with an email that already exists in the db, we will get an error as follows:
```JSON
{
  "errors": [
    {
      "message": "Response code 500 (Internal Server Error)",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "createUser"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "exception": {
          "name": "HTTPError",
          "stacktrace": [
            "HTTPError: Response code 500 (Internal Server Error)",
            "    at EventEmitter.<anonymous> (/opt/app/node_modules/got/dist/source/as-promise.js:108:31)",
            "    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
          ]
        }
      }
    }
  ],
  "data": null
}
```
This is not a very nice fomated error. We can handle these error in a nicer way.
- add the `lodash` module by running `yarn add lodash` in the `terminal` window in the `api-gateway` root folder.

- create a new file `api-gateway\src\server\formatGraphQLError.js` and add the following:
```javascript
  import _ from 'lodash'

  const formatGraphQLError = error => {
    const errorDetails = _.get(error, 'originalError.response.body')
    try {
      if (errorDetails) return JSON.parse(errorDetails)
    } catch (e) {}

    return error
  }

  export default formatGraphQLError
```
As we are using `got` to fetch data from the api, when there is an error `got` returns the original error as part of the body of the response. We are extracting this error and returning it back to the user. There are some cases that there will be an error without any indcation in the response body, and in this case we will return the error back to the user. This is in the case that the error is from the GraphQL engine and not the db.
- now add the following in the `startServer.js` file, to include the error details handling:
```javascript
  ...
  import accessEnv from '#root/helpers/accessEnv'
  import formatGraphQLError from './formatGraphQLError'

  const PORT = accessEnv('PORT', 7000)

  const apolloServer = new ApolloServer({
    formatError: formatGraphQLError,
    resolvers,
    typeDefs
  })
...
```
- now if we will try to create a new user with an email that already exists in the db, we will get the following response (in the graphQL playground):
```JSON
  {
    "errors": [
      {
        "message": "Validation error"
      }
    ],
    "data": null
  }
```
This way the error is more meanigful

### Step 15
Now let's add some frontend content.
- in the `classified-service` folder run `yarn init -y`. This will start the `package.json`.
- add the following modules:
```sh
yarn add -D parcel-bundler
```
this will add the `parcel` (in production it is preferable to use `webpack` as the bundler). This specific one will install any missing fependencies that we are going to reference.
- create a new file `index.html` and add the following content:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Classified App</title>
</head>
<body>
    <div id="app"></div>
    <script src="./index.js"></script>
</body>
</html>
```
- create a new file `index.js' and add the following:
```javascript
import React from 'react'
import { render } from 'react-dom'

render(<h1>App is working</h1>, document.getElementById('app'))
```
- add a new `scripts` section in the `package.json` file:
```JSON
"scripts": {
  "watch": "parcel --port=7001 src/index.html"
}
```
add also an `alias` section with:
```JSON
"alias": {
  "#root": "./src"
}
```
- in the `classifeid-service` terminal window run `yarn watch`. This will install the missing dependencies and run the app.
- open a new brwoser window and go to `http://localhost:7001` to open the main page of the application.
- create a new file `components\Root\Root.js` and add the following:
```javascript
import React from 'react'

export default function Root () {
  return (
    <div>
      <h1>Root</h1>
    </div>
  )
}
```
- create a new file `components\Root\index.js` and add:
```javascript
import Root from './Root'

export default Root
```
- add to `src/index.js` an import of `Root` as follows:
```javascript
import Root from '#root/components/Root'
```
- replace the `render` section in the `index.js` file to:
```javascript
render(<Root/>, document.getElementById('app'))
```
- now let's add some formating to the page, starting with the *Roboto* Google font. Open a new browser window and:
  - go to the url: `http://fonts.google.com`
  - search for the *Roboto* font.
  - in the *Roboto* font card, click on the *red* (+) sign to add it to the selection.
  - on the selected font window, click on the *customize* section, and select 400 and 700 font weights.
  - click on the *@import@ tag, and copy the url.
- add the following to the `index.js` file:
```javascript
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

  html, body, #app {
    display: flex;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Roboto, sans-serif";
  }
 `
 ``` 
 then add the `GlobalStyle` to the `render` as follows:
 ```javascript
 render(
   <>
    <GlobalStyle />
      <Root />
   </>, document.getElementById("app")   
 )
 ```
 - now, let's add the page structure with a content and a sidebar sections. In the `Root.js` file add the following:
 ```javascript
 import { styled } from 'styled-components'

  const Wrapper = styled.div`
  box-sizing: border-box;
  height: 100vh;
  padding: 1rem;
  width: 100vw;
`
const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 0 auto;
  width: 90vw;
`

const Content = styled.div`
  flex: 1;
  margin-right: 1rem;
`

const Sidebar = styled.div`
  flex: 0 auto;
  width: 10vw;
`
```
and change the `return` to:
```javascript
return (
  <Wrapper>
    <Container>
      <Content>Content</Content>
      <Sidebar>Sidebar</Sidebar>
    </Container>
  </Wrapper>    
)       
```

### Step 16
Before we continue building the app, we need to add some additional routes for the `users-service` that will take care of a user login.
- in the `users-service\src\server\routes.js` file add a new route:</br>
  note: instead of calling this route 'login' we call it 'sessions' as we are actually creating a session for the user as a side effect of a login.
```javascript
...
import comparePassword from "#root/helpers/comparePassword"
...
  app.post('/sessions', async (req, res, next) => {
    if ((!req.body.password, !req.body.password)) {
      return next(new Error('Invalid body'))
    }
    try {
      const oneUser = await User.findOne({
        attributes: {},
        where: { email: req.body.email }
      })
      if (!oneUser) {
        return next(new Error('Invalid Credentials'))
      }
      if (!comparePassword(req.body.password, oneUser.passwordHash)) {
        return next(new Error('Invalid Credentials'))
      }
    } catch (e) {
      return next(e)
    }
  })
```
this will give us the options to send `email` and `password`, get the data from the db about the user, compare te password recevied from the user and the one in the db, and return if both password match or not. Once all is working, have the errors send back when email or password are inccorect not to include the reason, but only that the login had faild. That way the user will not know if it was the provided password or the email were wrong. It will help prevent from hacking.

- We want the login session to expire within 1 hour so let's add a module that add date and time functunality:</br>
in the `terminal` windows within the `users-service` folder run `yarn add date-fns`, then add the following to the `routes.js` file:

```javascript
...
import { addHours} from 'date-fns'
...
const USER_SESSION_EXPIRY_HOURS = 1

const setupRoutes...
...
if (!comparePassword(req.body.password, oneUser.passwordHash)) {
        return next(new Error('Invalid Credentials'))
}

const expiresAt = addHours(new Date(), USER_SESSION_EXPIRY_HOURS)

const sessionToken = generateUUID()

const userSession = await UserSession.create({
  id: sessionToken,
  expiresAt,
  userId: oneUser.id
})
  return res.json(userSession)
...
- now we need to implemet this route in the `api-gateway`. In the  `api-gatway\src\graphql\typeDefs.js` file add a new `Mutation` for creating the *userSession*:
```javascript
const typeDefs = gql`
  scalar Date
```
this will add a new scalar to take care of the presentation of the dates. We can format the scalars, but in this case we will keep it in its origin format</br>
then add also:
```javascript
type UserSession {
  id: ID!
  user: User!
  expiresAt: Date!
  createdAt: Date!
}

type Mutation {
  ...
  createUserSession(email: String!, password: String!): UserSession!
  ...
}
```
- now we need to add the resolver for `createUserSession`. In the `api-gatway\src\graphql\resolvers\Mutation` folder create a new file `createUserSession.js` and add the following:
```javascript
import UsersService from '#root/adapters/UsersService'

const createUserSessionResolver = async (obj, { email, password }) => {
  const userSession =  await UsersService.createUserSession({ email, password })

  //
}

export default createUserSessionResolver
```
- as we are using `createUserSession` we need to specify it in the `adapters\userService.js` file:
```javascript
...
static async createUserSession ({ email, passowrd }) {
    const body = await got
      .post(`${USERS_SERVICE_URI}/sessions`, {
        json: { email, password }
      })
      .json()
    return body
  }
...
```
- now that we have the `userSession` create, we need to write back some infomration into the session cookie, but graphQL does not have a direct access to the session cookie. We need to add a context to the `startServer.js` that will allow us to do so.<br>
  in the `startServer.js` file add the following:
  ```javascript
  ... const apolloServer = new ApolloServer({
    context: a=> a,
    ...
  })
  ```
  this defines the third parameter of the Apollo graphQL server, context. This will allow to access the cookie within the graphQL server.
  In the `createUserSession.js` file we can now add the `context` as parameter to the resolver, and then use it to write back the response to the session cookie:
  ```javascript
  import UsersService from '#root/adapters/UsersService'

  const createUserSessionResolver = async (obj, { email, password }, context) => {
    const userSession =  await UsersService.createUserSession({ email, password })

    //
    context.res.cookie("userSessionId", userSession.id, { httpOnly: true})

    return userSession
  }
  ```
  the way that we are setting the cookie:
  - the name of the cookie is "userSessionid"
  - the value that we place in it is `userSession.id`
  - to add more security and allowing only http requests to access it, and not other javascript scripts on the page, is by adding `{httpOnly: true}` that will do that.
- the step is to add the new fucntion to the `Mutation\index.js` file as:
```javascript
export { default as createUserSession } from './createUserSession'
```
- open the GraphQL playground, refresh the page and try to create a new userSession as:
```graphql
  mutation{
    createUserSession(email:"test1@example.com", password:"test"){
      id
      expiresAt
      createdAt
      user{
        id
        email
      }
    }
  }
```





import { Sequelize } from 'sequelize'

import accessEnv from '#root/helpers/accessEnv'

const DB_URI = accessEnv('DB_URI')
const PG_DATABASE = accessEnv('PG_DATABASE')
const PG_USERNAME = accessEnv('PG_USERNAME')
const PG_PASSWORD = accessEnv('PG_PASSWORD')

// mySQL
// const sequelize = new Sequelize(DB_URI, {
//   dialectOptions: {
//     charset: 'utf8',
//     multipleStatements: true
//   },
//   logging: false
// })

// postgres
const sequelize = new Sequelize(PG_DATABASE, PG_USERNAME, PG_PASSWORD, {
  dialect: 'postgres',
  host: 'users-service-db',
  port: 5432
})

export default sequelize

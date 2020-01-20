// module.exports.development = {
//     dialect: "mysql",
//     seederStorage: "sequelize",
//     url: process.env.DB_URI
//   };
module.exports.development = {
    dialect: "postgres",
    seederStorage: "sequelize",
    url: process.env.DB_URI
  };
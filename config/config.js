module.exports = {
  development: {
    url: "postgres://tuicensd:bf-SsvDnqTZW2OOGGrsE5oHxPJBauaxg@abul.db.elephantsql.com/tuicensd",
    dialect: "postgres",
    operatorsAliases: "0",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
    operatorsAliases: "0",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

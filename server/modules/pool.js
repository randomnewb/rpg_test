const pg = require("pg");

if (process.env.DATABASE_URL) {
  const url = require("url");
  let config = {};
  // Heroku gives a url, not a connection object
  // https://github.com/brianc/node-pg-pool
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(":");

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: process.env.DATABASE_NAME || params.pathname.split("/")[1],
    ssl: { rejectUnauthorized: false },
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
}
// When we're running this app on our own computer
// we'll connect to the postgres database that is
// also running on our computer (localhost)
if (process.env.DATABASE_PASSWORD) {
  pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "rpg_app",
    password: process.env.DATABASE_PASSWORD,
  });
} else {
  pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "rpg_app",
  });
}

if (process.env.DATABASE_URL) {
  // this creates the pool that will be shared by all other modules
  const pool = new pg.Pool(config);

  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on("error", (err) => {
    console.log("Unexpected error on idle client", err);
    process.exit(-1);
  });
}

module.exports = pool;

const Pool = require('pg').Pool;

const pgConn = {
  user: 'postgres',
  host: 'localhost',
  database: 'Academic',
  scheme: 'AcadSchema',
  password: 'Igbaro1212.',
  port: 5432,
};



const pool = new Pool(pgConn);
module.exports = pool;
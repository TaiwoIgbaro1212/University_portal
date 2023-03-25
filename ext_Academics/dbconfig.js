const Pool = require('pg').Pool;

const pgConn = {
  user: 'postgres',
  host: '192.168.17.220',
  database: 'Academic',
  scheme: 'AcadSchema',
  password: 'Igbaro1212.',
  port: 5432,
};



const pool = new Pool(pgConn);
module.exports = pool;
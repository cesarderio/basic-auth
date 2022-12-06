'use strict';

let { start } = require('./src/server');

let { sequelizeDatabase } = require('./src/auth/models/index');

sequelizeDatabase.sync()
  .then(() => {
    // console.log('Successfully Connected');
    console.log('Server up');
    start();
  })
  .catch((e) => console.error(e));

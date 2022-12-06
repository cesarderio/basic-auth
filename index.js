'use strict';

let { start, sequelizeDatabase } = require('./src/server');

sequelizeDatabase.sync()
  .then(() => {
    // console.log('Successfully Connected');
    console.log('Server up');
    start();
  })
  .catch((e) => console.error(e));

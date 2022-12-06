'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./auth/router');
const notFound = require('./middleware/404');
const errorHandler = require('./middleware/500');

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(authRouter);
app.use('*', notFound);
app.use(errorHandler);

module.exports = {
  app,
  start: () => app.listen(PORT, console.log('server running on port', PORT)),
};

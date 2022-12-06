'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const usersModel = require('./users-model');
// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const base64 = require('base-64');

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

// instantiate our sequelize connection to our database
let sequelizeDatabase;
if(process.env.NODE_ENV === 'test'){
  sequelizeDatabase = new Sequelize({
    dialect: 'sqlite',
    database: ':memory',
  });
}else {
  sequelizeDatabase = new Sequelize(DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

const UsersModel = usersModel(sequelizeDatabase, DataTypes);

module.exports = {
  sequelizeDatabase,
  UsersModel,
};

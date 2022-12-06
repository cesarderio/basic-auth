'use strict';

require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
// const { Sequelize, DataTypes } = require('sequelize');
// const notFound = require('./middleware/404');
// const errorHandler = require('./middleware/500');

// const userRouter = require('./auth/routes/users');
const Users = require('../models/users-model');


module.exports = ( basicA ) => {

  async function basicAuth(req, res, next){
    let { authorization } = req.headers;
    console.log('authorization::::', authorization);  // Basic UnlhbjpwYXNz - basic Auth from class demo


    if(!authorization){
      res.status(401).send('Not Authorized!');
    } else {
      let basicHeaderParts = authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
      let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
      let decodedString = base64.decode(encodedString); // "username:password"
      let [username, password] = decodedString.split(':'); // username, password

      // find user in database
      let user = await Users.findOne({where: {username}});
      // console.log('user from database', username);
      // const valid = await bcrypt.compare(password, user.password);


      if(user){
        let validUser = await bcrypt.compare(password, user.password);
        console.log('validUser', validUser);

        if(validUser){
          req.user = user;
          next();

        } else {
          next('Invalid User');
        }
      }
      next();
    }
  }
};

'use strict';

// 3rd Party Resources
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { Sequelize, DataTypes } = require('sequelize');

const notFound = require('./middleware/404');
const errorHandler = require('./middleware/500');

// NOTE: connected to sqlite::memory out of box for proof of life
// TODO:
// connect postgres for local dev environment and prod
// handle SSL requirements
// connect with sqlite::memory for testing
// const DATABASE_URL = 'sqlite:memory';
const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

// Prepare the express app
const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());

app.use(cors());
// Process JSON input and put the data on req.body

app.use(notFound);
app.use(errorHandler);


const sequelizeDb = new Sequelize(DATABASE_URL);

// Process FORM intput and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// Create a Sequelize model
const Users = sequelizeDb.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Users.beforeCreate((user) => {
  console.log('our user', user);
});

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
    // let authStr = authorization.split(' ')[1];
    // console.log('authStr:', authStr);
    // aka encoded Raphael:pass

    // let decodedAuthStr = base64.decode(authStr);
    // console.log('decodedSAuthStr:', decodedAuthStr);
    // Raphael:pass

    // extracting username and password from auth string
    // let [username, password] = decodedAuthStr.split(':');
    // console.log('username', username);
    // console.log('password', password);

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


// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
app.post('/signup', async (req, res, next) => {
  try {
    let { username, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 10);

    let record = await Users.create({
      username,
      password: encryptedPassword,
    });
    //  req.body.password = await bcrypt.hash(req.body.password, 10);
    // const record = await Users.create(req.body);
    // res.status(200).json(record);
    res.status(200).send(record);
  // } catch (e) { res.status(403).send('Error Creating User'); }
  } catch (e) {
    next('Error Creating User');
  }
});


// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
app.post('/signin', basicAuth, (req, res, next) => {
  res.status(200).send(req.user);
  // try {
  //   const user = await Users.findOne({ where: { username: username } });
  //   const valid = await bcrypt.compare(password, user.password);
  //   if (valid) {
  //     res.status(200).json(user);
  //   }
  //   else {
  //     throw new Error('Invalid User');
  //   }
  // } catch (error) { res.status(403).send('Invalid Login'); }
  /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

  // let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  // let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  // let decodedString = base64.decode(encodedString); // "username:password"
  // let [username, password] = decodedString.split(':'); // username, password

  /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
});

// make sure our tables are created, start up the HTTP server.
// sequelizeDb.sync()
//   .then(() => {
//     app.listen(3000, () => console.log('server up'));
//   }).catch(e => {
//     console.error('Could not start server', e.message);
//   });

module.exports = {
  app,
  start: () => app.listen(PORT, console.log('server running on port', PORT)),
  sequelizeDb,
};

'use strict';

require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const notFound = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
// const PORT = process.env.PORT || 3002;
const { userInterface } = require('./models/index');

const router = express.Router();
const app = express();
// app.use(cors());
app.use(express.json());

// app.get('/', (req, res, next) => {
//   res.status(200).send('Hello World');
// });
app.use('*', notFound);
app.use(errorHandler);
// function start(){
//   app.listen(PORT, () => console.log('listening on port', PORT));
// }

router.get('/users', async (req, res, next) => {
  // const users = await User.findAll();
  try {
    const users = await userInterface.read();
    res.status(200).send(users);
  } catch (e) {
    next(e);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const UserById = await userInterface.read(id);
    res.status(200).send(UserById);
  } catch(e) {
    next(e);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const newUser = await userInterface.create(req.body);
    res.status(200).send(newUser);
  } catch (e) {
    next(e);
  }
});

router.put('/users/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedUser = await userInterface.update(req.body, id );
    res.status(200).send(updatedUser);
  } catch(e) {
    next(e);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const UserById = await userInterface.delete(id);
    res.status(200).send(UserById);
  } catch(e) {
    next(e);
  }
});

module.exports = router;

module.exports = { app, start };

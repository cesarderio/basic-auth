'use strict';

module.exports = (req, res, next) => {
  res.status(404).send({
    error: 404,
    router: req.baseUrl,
    message: 'Not Found',
  });
};

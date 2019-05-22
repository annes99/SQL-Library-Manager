var express = require('express');
var router = express.Router();

/* GET home page. */
// get / - Home route should redirect to the /books route.
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;

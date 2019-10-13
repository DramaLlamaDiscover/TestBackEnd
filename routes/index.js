var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/apples', function(req, res) {
  console.log("Attempting to access apples");
  console.log("The amount of apples you want is " + req.body.apples);
  var applesText = "";
  for(var i = 0; i < req.body.apples; i++)
  {
    applesText = applesText + "apple ";
  }
  res.send(applesText);
});

module.exports = router;

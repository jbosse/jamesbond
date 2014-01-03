"use strict";

module.exports = function(){
  var express = require('express');
  var app = express();

  app.get('/', function(req, res){
    res.render('table', { title: 'Table' });
  });

  return app;
}();
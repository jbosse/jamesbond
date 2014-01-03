"use strict";

module.exports = function(){
  var express = require('express');
  var app = express();

  app.get('/', function(req, res){
    res.render('index', { title: 'Table' });
  });

  return app;
}();
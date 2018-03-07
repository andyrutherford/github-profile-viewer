var router = require('./router.js');

// Create web server
var http = require('http');
http.createServer(function (request, response) {

  //Index page
  router.home(request, response);

  //User page
  router.user(request, response);

//Assign port dynamically or localhost:3000
}).listen(process.env.PORT || 3000);
console.log('Server running at https://fathomless-dawn-51692.herokuapp.com/ or http://localhost:3000/');

var Profile = require('./profile.js');
var renderer = require('./renderer.js');
var queryString = require('querystring');

var commonHeaders = {'Content-Type': 'text/html'}

// Handle http route GET / and POST (Home)
function home(request, response) {
  //if url == '/' && GET
  if(request.url === '/') {
    if(request.method.toLowerCase() === 'get') {
      //show search
      response.writeHead(200, commonHeaders);
      renderer.view('header', {}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    } else {
      //if url == '/' && POST

      //get the post data from body
      request.on('data', function(postBody) {
        //extract the username
        var query = queryString.parse(postBody.toString());
        //redirect to /:username
        response.writeHead(303, {'Location': '/' + query.username});
        response.end();
      });

    }
  }

}
// Handle HTTP route GET /:username
function user(request, response) {
  //if url == '/...'
  var username = request.url.replace('/', '');
  if(username.length > 0) {
    response.writeHead(200, commonHeaders);
    renderer.view('header', {}, response);

    //get json from treehouse
    var user = new Profile(username);
    //on 'end', show profile
    user.on('end', function(profileJSON) {
      //show profile

      //store values needed
      var values = {
        avatarURL:        profileJSON.avatar_url,
        username:         profileJSON.login,
        name:             profileJSON.name,
        location:         profileJSON.location,
        website:          profileJSON.blog,
        repos:            profileJSON.public_repos,
        followers:        profileJSON.followers
      }
      //simple response
      renderer.view('profile', values, response);
      renderer.view('footer', {}, response);
      response.end();
    });

    //on 'error', show error
    user.on('error', function(error) {
      renderer.view('error', {errorMessage: error.message}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    });

  }
}

module.exports.home = home;
module.exports.user = user;

var http = require('http'), 
    url = require('url'), 
    path = require('path'), 
    fs = require('fs');

http.createServer(onRequest).listen(3050);

function onRequest(client_req, client_res) {
  var request = url.parse(client_req.url, true);
  var uri = request.pathname;
  var symbol = "USSLIND";
  if ("sym" in request.query) {
    symbol = request.query.sym;
  }
  
  console.log('serve: ' + uri);

  if (uri === '/fred') {

    key = require('./fred-key.json');

    var options = {
      hostname: 'api.stlouisfed.org',
      port: 80,
      //path: "/fred/series/observations?series_id=" + symbol + "&api_key=" + key.api_key + "&file_type=json&observation_start=1993-12-31",
      path: "/fred/series/observations?series_id=" + symbol + "&api_key=" + key.api_key + "&file_type=json",
      method: 'GET'
    };

    var proxy = http.request(options, function (res) {
      res.pipe(client_res, {
        end: true
      });
    });

    client_req.pipe(proxy, {
      end: true
    });
  }
  else {
    if (uri === '/') {
      uri = '/dashboard.html';
    }
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {
        if(!exists || uri == '/fred-key.json') {
            console.log("not exists: " + filename);
            client_res.writeHead(404, {'Content-Type': 'text/plain'});
            client_res.write('404 Not Found\n');
            client_res.end();
            return;
        }
        var mimeType = "text/html";
        if (uri.slice(-5) == '.json') {
            mimeType = "application/json";
        }
        client_res.writeHead(200, {'Content-Type': mimeType});

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(client_res);

    }); //end fs.exists    
  }
}
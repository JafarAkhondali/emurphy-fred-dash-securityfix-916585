var http = require('http'), 
    url = require('url'), 
    path = require('path'), 
    fs = require('fs');

http.createServer(onRequest).listen(3050);

function onRequest(client_req, client_res) {
  var uri = url.parse(client_req.url).pathname;
  console.log('serve: ' + uri);

  if (uri === '/fred') {

    key = require('./fred-key.json');

    var options = {
      hostname: 'api.stlouisfed.org',
      port: 80,
      path: "/fred/series/observations?series_id=USSLIND&api_key=" + key.api_key + "&file_type=json",
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
      uri = '/us-leading-index.html';
    }
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {
        if(!exists) {
            console.log("not exists: " + filename);
            client_res.writeHead(404, {'Content-Type': 'text/plain'});
            client_res.write('404 Not Found\n');
            client_res.end();
            return;
        }
        client_res.writeHead(200, {'Content-Type':"text/html"});

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(client_res);

    }); //end fs.exists    
  }
}
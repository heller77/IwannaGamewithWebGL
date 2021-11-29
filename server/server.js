const mime = require('mime-types');
const port = 8080;
var http = require('http');
var fs = require('fs');
var http_server = new http.createServer(function (req, res) {
    var url = decodeURI('.' + req.url);
    if (!fs.existsSync(url)) {
        console.log(url + " not found");
    } else {
        let type = mime.lookup(url);
        type = type ? type : "application/etc";
        //console.log('>>'+'.'+url+':'+type);
        let encoding = type.hasOwnProperty('includes') ? (type.includes('text') ? 'UTF-8' : null) : null;
        let data = fs.readFileSync(url, encoding);
        res.writeHead(200, {'Content-Type': type});
        res.end(data);
    }
}).listen(port);
console.log('Check http://localhost:' + port + '/ on brouser.');
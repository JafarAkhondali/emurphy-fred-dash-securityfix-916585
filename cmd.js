path = require('path'),
    fs = require('fs')
    shiller_sp = require('./shiller_sp.js');


//var data = shiller_sp.sp_pe10(1993, 1);
var data = shiller_sp.sp_pe10();

fs.writeFile('./sp_pe10.json', JSON.stringify(data));

var XLSX = require('xlsx'),
    path = require('path');

module.exports.sp_pe10 = function () {

    var workbook = XLSX.readFile(path.join(process.cwd(), 'data/shiller_sp_earnings_data.xls'));

    var worksheet = workbook.Sheets["Data"];

    var series = {observations: []};
    for (i = 129; i < 2500; i++) {
        var date = worksheet['A' + i];
        var pe_ratio = worksheet['K' + i];

        if (typeof date !== 'undefined' && typeof pe_ratio !== 'undefined') {
            series.observations.push({date: date.v.toString(), value: pe_ratio.v});
        }
        series.count = series.observations.length;
    }
    return series;
};



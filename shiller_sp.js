var XLSX = require('xlsx'),
    path = require('path');

module.exports.sp_pe10 = function (start_year, start_month) {

    var workbook = XLSX.readFile(path.join(process.cwd(), 'data/shiller_sp_earnings_data.xls'));

    var worksheet = workbook.Sheets["Data"];

    var series = {observations: []};
    for (i = 129; i < 2500; i++) {
        var date = worksheet['A' + i];
        var pe_ratio = worksheet['K' + i];

        if (typeof date !== 'undefined' && typeof pe_ratio !== 'undefined') {
            if (typeof start_year === 'undefined' || date_after(start_year, start_month, date.v)) {
                series.observations.push({date: format_date(date.v.toString()), value: pe_ratio.v});
            }
        }
        series.count = series.observations.length;
    }
    return series;
};

function date_after(start_year, start_month, year_dot_month) {
    var year = Math.floor(year_dot_month);
    if (year > start_year) {
        return true;
    }
    else if (year === start_year) {
        if (typeof start_month === 'undefined') {
            return true;
        }
        else {
            return parseInt(month(year_dot_month)) >= start_month;
        }
    }
    else {
        return false;
    }

}

function month(year_dot_month) {
    var month = year_dot_month.split(".")[1];
    if (month == '1') {
        month = '10';
    }
    return month;
}

function year(year_dot_month) {
    return year_dot_month.split(".")[0];
}

function format_date(year_dot_month) {
    return year(year_dot_month) + '.' +  month(year_dot_month);
}



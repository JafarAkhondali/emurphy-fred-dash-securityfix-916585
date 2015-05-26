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

module.exports.sp_all = function (start_year, start_month) {

    var workbook = XLSX.readFile(path.join(process.cwd(), 'data/shiller_sp_earnings_data.xls'));

    var worksheet = workbook.Sheets["Data"];

    var series = {observations: []};
    for (i = 129; i < 2500; i++) {
        var date = worksheet['A' + i];

        if (typeof date !== 'undefined') {
            if (typeof start_year === 'undefined' || date_after(start_year, start_month, date.v)) {
                series.observations.push({date: format_date(date.v.toString()),
                                          price: cell_value(worksheet, 'B', i), dividend: cell_value(worksheet, 'C', i),
                                          earnings: cell_value(worksheet, 'D', i), CPI: cell_value(worksheet, 'E', i),
                                          treasury_10yr_rate: cell_value(worksheet, 'G', i),
                                          real_price: cell_value(worksheet, 'H', i),
                                          real_dividend: cell_value(worksheet, 'I', i),
                                          real_earnings: cell_value(worksheet, 'J', i),
                                          pe10_ratio: cell_value(worksheet, 'K', i)});
            }
        }
        series.count = series.observations.length;
    }
    return series;
};

function cell_value(worksheet, column, row) {
    var cell = worksheet[column + row];
    return typeof cell !== 'undefined' ? cell.v : null;
}

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



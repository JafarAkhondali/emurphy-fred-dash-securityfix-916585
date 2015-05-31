var XLSX = require('xlsx'),
    path = require('path'),
    http = require('http'),
    key = require('./fred-key.json');

Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
};

module.exports.sp_pe10 = function (callback, start_year, start_month) {

    var workbook = XLSX.readFile(path.join(process.cwd(), 'data/shiller_sp_earnings_data.xls'));

    var worksheet = workbook.Sheets["Data"];

    var series = {observations: [], latest: null};
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

    pe10_ratio_latest(this.sp_all(start_year, start_month), function(date, value) {
      series.latest = {date: date, value: value};
      callback(series);
    });

    return series;
};

module.exports.sp_all = function (start_year, start_month) {

    var workbook = XLSX.readFile(path.join(process.cwd(), 'data/shiller_sp_earnings_data.xls'));

    var worksheet = workbook.Sheets["Data"];

    var series = []
    for (i = 129; i < 2500; i++) {
        var date = worksheet['A' + i];

        if (typeof date !== 'undefined') {
            if (typeof start_year === 'undefined' || date_after(start_year, start_month, date.v)) {
                series.push({date: format_date(date.v.toString()),
                                          price: cell_value(worksheet, 'B', i), dividend: cell_value(worksheet, 'C', i),
                                          earnings: cell_value(worksheet, 'D', i), CPI: cell_value(worksheet, 'E', i),
                                          treasury_10yr_rate: cell_value(worksheet, 'G', i),
                                          real_price: cell_value(worksheet, 'H', i),
                                          real_dividend: cell_value(worksheet, 'I', i),
                                          real_earnings: cell_value(worksheet, 'J', i),
                                          pe10_ratio: cell_value(worksheet, 'K', i)});
            }
        }
    }
    return series;
};

function pe10_ratio(sp_price, sp_all) {
  var sum = 0;
  for( var i = sp_all.length - 121; i < sp_all.length; i++ ){
    if (sp_all[i].real_earnings) {
      sum += sp_all[i].real_earnings;
    }
  }

  var avg = sum/120;
  return sp_price / avg;
}

function pe10_ratio_latest(sp_all, callback) {
  var today = new Date();
  var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

  http.get("http://api.stlouisfed.org/fred/series/observations?series_id=sp500&api_key=" + key.api_key +
           "&file_type=json&sort_order=desc&observation_start=" + lastWeek.yyyymmdd(), function(response) {
    response.on('data', function (chunk) {
      var series = JSON.parse(chunk);
      var pe10 = pe10_ratio(series.observations[0].value, sp_all)
      callback(series.observations[0].date, pe10);
    });
  });
}

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



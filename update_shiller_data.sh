#!/usr/bin/env bash
# download latest Shiller SP500 earnings spreadsheet and generate json
#
# example crontab entry:
#
# update Shiller SP500 PE10 data at least monthly
# 0 12 * * 1   /<path>/<to>/data/update_shiller_data.sh

cd /work/fred-dash
curl http://www.econ.yale.edu/~shiller/data/ie_data.xls -o data/shiller_sp_earnings_data.xls
node cmd.js
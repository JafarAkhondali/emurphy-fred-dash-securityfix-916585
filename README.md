# fred-dash

## Getting Started

Sign up for [FRED](https://research.stlouisfed.org/) and save the API key in a JSON file called fred-key.json, e.g.:

```
{
  "api_key": "abcdefghijklmnopqrstuvwxyz123456"
}
```


Install node.js.

`node server.js`

Local directory paths and server port are hard-coded, search for 3500 and /work/fred-data to replace (or more happily 
submit a pull request with a package.json that takes care of dependencies and global constants). 

To update Shiller's S&P 500 earnings data, install npm packages:

`npm install xlsx`
 
And run:
 
`./update_shiller_date.sh`
 
This can be scheduled, for example with:

```
# update Shiller SP500 PE10 data at least monthly
# 0 12 * * 1   /<path>/<to>/update_shiller_data.sh
```


From your browser hit `http://localhost:3050`


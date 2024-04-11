var childProcess = require('child_process');
var chromedriver = require('chromedriver');
var binPath = chromedriver.path;

var childArgs = [
  './Selenium_testing/*.side'
];

childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  // handle results
  console.error(err)
  console.error(stderr)
  console.log(stdout)
});
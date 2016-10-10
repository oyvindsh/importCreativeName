var SensorTag = require('sensortag');

var log = function(text) {
  if(text) {
    console.log(text);
  }
}

var xTresh = -0.7;
var zTresh = 0.5;

// (replace the one below).
var ADDRESS = "b0:b4:48:bd:ce:04";
var connected = new Promise((resolve, reject) => SensorTag.discoverByAddress(ADDRESS, (tag) => resolve(tag)))
  .then((tag) => new Promise((resolve, reject) => tag.connectAndSetup(() => resolve(tag))));

var sensor = connected.then(function(tag) {
  log("connected");

  tag.enableAccelerometer(log);
  tag.notifyAccelerometer(log);

  return tag;
});


sensor.then(function(tag) {
  tag.on("accelerometerChange", function(x,y,z) {

    if (x < xTresh) {
      // vi heller siste rest av kaffe!
      log("Naa heller vi kaffe!!");
      handleKaffe();

    }
  });
});

var lastHelling = 0;
var timeout = false;

var handleKaffe = function () {
  if (timeout) {
    return;
  }
  timeout = true;
  setTimeout(function () {
    timeout = false;
  }, 50000);

  run_cmd('fswebcam', ["-r", "1280x720", "image.jpg"], function () {
    log("tok bilde");
  });
  setTimeout(function () {
    run_cmd ('python', ["tweeter.py", "Test 42", "image.jpg"], function () {
      log("oida");
    });
  }, 5000);
};

function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) {});
    child.stdout.on('end', function() {});
} // ()

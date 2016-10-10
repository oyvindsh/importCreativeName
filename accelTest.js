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
    if (x < xTresh && z > zTresh) {
      // vi heller siste rest av kaffe!
      log("Naa heller vi kaffe!!");
      log("x: " + x + "    y: " + y + "    z: " + z);


    }
  });
});

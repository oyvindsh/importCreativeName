var SensorTag = require('sensortag');
var fs = require('fs');

var log = function(text) {
  if(text) {
    console.log(text);
  }
}

var xTresh = -0.7;
var zTresh = 0.5;
var timeout = false;
var kaffeLevel = 1000;

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

var kaffeSkruddPaa = false;

var handleKaffe = function () {
  kaffeSkruddPaa = false;
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
    kaffeSkruddPaa();
  }, 450000);
  setTimeout(function () {
      if (!kaffeSkruddPaa) {
        run_cmd ('python', ["tweeter.py", "#kaffesynder tom for kaffe og lagde ikke ny #fuii #importCreativeName", "image.jpg"], function () {log("oida"); });
      } else {
        run_cmd ('python', ["tweeter.py", "#kaffepride tom for kaffe og lagde ny! #fuii #importCreativeName", "image.jpg"], function () {log("oida");});
          setTimeout(function () {
            run_cmd ('python', ["tweeter.py", "Nå er kaffen klar! #fuii #importCreativeName", "kaffe.jpg"], function () {log("oida");});
          }, 500000);
    });
  }, 300000);
};

function kaffeSkruddPaa() {
  run_cmd('wallplug_power.sh',[], function () {
    //
  });
  setTimeout(function () {
    var obj = JSON.parse(fs.readFileSync('wallplug_power.json','utf8'));
    if (obj.data.metrics.level > kaffeLevel) {
      kaffeSkruddPaa = true;
    }
  }, 500);
}

function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) {});
    child.stdout.on('end', function() {});
} // ()

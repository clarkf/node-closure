var JAR_PATH, JAVA_PATH, OPTIONS, path, spawn;
spawn = require('child_process').spawn;
path = require('path');
JAVA_PATH = exports.JAVA_PATH = 'java';
JAR_PATH = exports.JAR_PATH = path.join(__dirname, 'vendor/compiler.jar');
OPTIONS = exports.OPTIONS = {};
exports.compile = function(input, options, callback) {
  var args, compiler, error, result;
  if (callback) {
    result = {};
    Object.keys(OPTIONS).forEach(function(key) {
      return result[key] = OPTIONS[key];
    });
    Object.keys(options).forEach(function(key) {
      return result[key] = options[key];
    });
    options = result;
  } else {
    callback = options;
    options = OPTIONS;
  }
  args = ['-jar', JAR_PATH];
  Object.keys(options).forEach(function(key) {
    if (options[key] === false) {
      return;
    }
    args.push("--" + key);
    if (options[key] !== true) {
      return args.push("" + options[key]);
    }
  });
  compiler = spawn(JAVA_PATH, args);
  result = '';
  error = '';
  compiler.stdout.addListener('data', function(data) {
    return result += data;
  });
  compiler.stderr.addListener('data', function(data) {
    return error += data;
  });
  compiler.addListener('exit', function(code) {
    var errors;
    if (code === 0) {
      return callback(null, result);
    }
    errors = /ERROR - (.+)/.exec(error);
    return callback(new Error(errors[1] || 'unknown error'), null);
  });
  return compiler.stdin.end(input);
};
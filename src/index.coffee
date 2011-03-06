spawn = require('child_process').spawn
path  = require 'path'

JAVA_PATH = exports.JAVA_PATH = 'java'
JAR_PATH  = exports.JAR_PATH  = path.join __dirname, 'vendor/compiler.jar'
OPTIONS   = exports.OPTIONS   = {}

exports.compile = (input, options, callback) ->
  if callback
    result = {}
    Object.keys(OPTIONS).forEach (key) ->
      result[key] = OPTIONS[key]
    Object.keys(options).forEach (key) ->
      result[key] = options[key]
    options = result
  else
    callback = options
    options = OPTIONS

  args = ['-jar', JAR_PATH]

  Object.keys(options).forEach (key) ->
    return if options[key] is false
    args.push "--#{key}"
    args.push "#{options[key]}" unless options[key] is true

  compiler = spawn JAVA_PATH, args
  result = ''
  error = ''

  compiler.stdout.addListener 'data', (data) ->
    result += data
  compiler.stderr.addListener 'data', (data) ->
    error += data

  compiler.addListener 'exit', (code) ->
    return callback(null, result) if code is 0
    errors = (/ERROR - (.+)/).exec(error)
    return callback(new Error(errors[1] or 'unknown error'), null)

  compiler.stdin.end(input)

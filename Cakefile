task 'build', 'Build the source to Javascript', ->
  coffee = require('child_process').spawn 'coffee', ['-c', '--bare', '-o', 'lib/closure-compiler/', 'src/index.coffee']
  coffee.stderr.on('data', (data) -> console.error(data.toString()))

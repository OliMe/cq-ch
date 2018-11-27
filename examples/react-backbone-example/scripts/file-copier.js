var fs = require('fs');
var path = require('path');

var files = [
    { 'build/backbone-app.css': 'backbone-app/styles/main.css' },
    { 'build/react-app.css': 'react-app/styles/main.css' },
]

files.forEach(function (file) {
  var destinationPath = Object.keys(file)[0],
    sourcePath = file[destinationPath]
  fs.copyFileSync(path.join(process.cwd(), sourcePath), path.join(process.cwd(), destinationPath))
})

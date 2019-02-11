'use strict'

let data = {
  url: 'https://www.gimp.org/downloads/',
  version: {
    selector: '#pushPage > section > div > div > div > p > b'
  },
  download: {
    selector: '#win-download-link'
  },
  install: function (output, iPath) {
    let installed = require('./../js/install_inno_with_type')(output, iPath, ['^\\lib\\python2.7', '^\\lib\\gimp\\2.0\\python', '^\\var'])
    if (installed) {
      let fs = require('fs')
      let path = require('path')

      let { dir: parentPath } = path.parse(iPath)

      while (parentPath.split(/[/\\]+/).includes('bin')) {
        parentPath = path.parse(parentPath).dir
      }

      fs.appendFileSync(path.resolve(parentPath, 'lib/gimp/2.0/environ', 'default.env'), `PATH=${parentPath}\\bin;${parentPath}\\32\\bin\nPYTHONPATH=${parentPath}\\32\\lib\\gimp\\2.0\\python;${parentPath}\\lib\\gimp\\2.0\\plug-ins\\python-console`)

      fs.appendFileSync(path.resolve(parentPath, 'lib/gimp/2.0/environ', 'pygimp.env'), `__COMPAT_LAYER=HIGHDPIAWARE`)

      fs.appendFileSync(path.resolve(parentPath, 'lib/gimp/2.0/interpreters', 'pygimp.interp'), `python=${parentPath}\\32\\bin\\pythonw.exe\npython2=${parentPath}\\32\\bin\\pythonw.exe\n/usr/bin/python=${parentPath}\\32\\bin\\pythonw.exe\n:Python:E::py::python:`)
    }
    return installed
  }
}
module.exports = data

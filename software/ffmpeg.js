'use strict'

let data = {
  useProxy: true,
  url: 'https://ffmpeg.zeranoe.com/builds/',
  version: {
    selector: 'label[title^="Nightly"]'
  },
  download: {
    plain: 'https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-latest-win64-static.zip'
  },
  install: function (output, iPath) {
    let killed = require('./../js/kill')(output, iPath)
    if (!killed) return false
    let {dir: parentPath, name} = require('path').parse(iPath)
    require('child_process').execSync(`plugins\\7z.exe e -y -o"unzip\\${name}\\" "${output}" "*\\bin\\*.exe"`)
    require('fs-extra').copySync(`unzip\\${name}\\`, parentPath)
    return true
  }
}
module.exports = data

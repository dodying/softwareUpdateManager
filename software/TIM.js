'use strict'

let data = {
  url: 'https://tim.qq.com/download.html',
  version: {
    selector: '.d-item-desc'
  },
  download: {
    selector: '.down-btn>a'
  },
  install: function (output, iPath) {
    let killed = require('./../js/kill')(output, iPath)
    if (!killed) return false
    const path = require('path')
    const fse = require('fs-extra')
    let parentPath = path.parse(iPath).dir

    while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }

    require('child_process').execSync(`plugins\\7z.exe x -y -o"unzip\\TIM\\" "${output}"`)
    try {
      fse.copySync('./unzip/TIM/Files', parentPath)
      fse.copySync('./unzip/TIM/Application Data', process.env.APPDATA)
      fse.copySync('./unzip/TIM/Common', require('os').arch() === 'x64' ? process.env['CommonProgramFiles(x86)'] : process.env.CommonProgramFiles)
      return true
    } catch (error) {
      return false
    }
  }
}
module.exports = data

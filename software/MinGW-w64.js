'use strict'

let data = {
  url: 'https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/',
  version: {
    selector: '.name'
  },
  download: {
    func: async (res, $, req, cheerio, choice) => {
      let list = [
        'win32-seh-x86_64',
        'win32-sjlj-i686',
        'win32-sjlj-x86_64',
        'win32-dwarf-i686',
        'posix-sjlj-x86_64',
        'posix-sjlj-i686',
        'posix-dwarf-i686',
        'posix-seh-x86_64'
      ]
      let index = -1
      if (typeof choice === 'number') index = choice
      while (index < 0) {
        index = require('readline-sync').keyInSelect(list, 'Please selct a version')
      }
      if (index >= 0) {
        let arr = list[index].split('-')
        let url = `https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/${$('.name').eq(0).text()}/threads-${arr[0]}/${arr[1]}/`
        let res1 = await req(url)
        let $1 = cheerio.load(res1.body)
        return $1(`a[href^="${url}${arr[2]}-${$('.name').eq(0).text()}-release-${arr[0]}-${arr[1]}"][href$=".7z/download"]`).eq(0).attr('href')
      }
    }
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  },
  afterInstall: function (output, iPath) {
    let path = require('path')
    let parentPath = path.parse(iPath).dir

    while (parentPath.split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }

    require('fs').copyFileSync(path.resolve(parentPath, 'bin', 'mingw32-make.exe'), path.resolve(parentPath, 'bin', 'make.exe'))
  },
  other: {
    'win32-seh-x86_64': { downloadChoice: 0 },
    'win32-sjlj-i686': { downloadChoice: 1 },
    'win32-sjlj-x86_64': { downloadChoice: 2 },
    'win32-dwarf-i686': { downloadChoice: 3 },
    'posix-sjlj-x86_64': { downloadChoice: 4 },
    'posix-sjlj-i686': { downloadChoice: 5 },
    'posix-dwarf-i686': { downloadChoice: 6 },
    'posix-seh-x86_64': { downloadChoice: 7 }
  }
}
module.exports = data

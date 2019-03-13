'use strict'

/**
 * @description Auto
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 */

let install = (from, to, excludes = undefined) => {
  const fse = require('fs-extra')
  const path = require('path')
  const cp = require('child_process')

  try {
    let info = cp.execSync(`plugins\\7z.exe l "${from}"`, { encoding: 'utf8' })
    info = info.split(/[\r\n]+/)

    let anchor = info.filter(i => i.match(/(-{4,}\s+){4}/))
    let start = info.indexOf(anchor[0])
    let end = info.indexOf(anchor[1], start + 1)
    info = info.splice(start + 1, end - start - 1)

    let files = []
    let anchorIndex = []
    anchor[0].split(/\s+/).forEach((item, index) => {
      let prev = index ? anchorIndex[index - 1].start + anchorIndex[index - 1].length : 0
      anchorIndex.push({
        start: anchor[0].indexOf(item, prev),
        length: item.length
      })
    })

    for (let i = 0; i < info.length; i++) {
      let arr = anchorIndex.map((item, index) => info[i].substr(item.start, index === anchorIndex.length - 1 ? info[i].length : item.length).trim())
      files.push({
        date: arr[0],
        attr: arr[1],
        size: arr[2],
        compressed: arr[3],
        name: arr[4]
      })
    }

    if (files.filter(i => i.name === '.rdata').length) {
      if (files.filter(i => i.name === '.rsrc\\version.txt').length) {
        cp.execSync(`plugins\\7z.exe e -y -o"unzip\\" "${from}" ".rsrc\\string.txt"`)
        let content = fse.readFileSync('./unzip/string.txt', 'utf-8')
        fse.unlinkSync('./unzip/string.txt')
        /* eslint-disable no-control-regex */
        content = content.replace(/\u0000/g, '')
        if (content.match('Advanced Installer')) {
          return require('./install_ai')(from, to, excludes)
        } else {
          return false
        }
      } else if (files.filter(i => i.name === 'DATA').length) {
        cp.execSync(`plugins\\7z.exe e -y -o"unzip\\" "${from}" "DATA"`)
        let content = fse.readFileSync('./unzip/DATA', 'utf-8')
        if (content.match('Inno Setup')) {
          let list
          try {
            list = cp.execSync(`plugins\\innounp.exe -t "${from}"`, { encoding: 'utf8' })
          } catch (error) {
            return false
          }
          list = list.split(/[\r\n]/).filter(i => i.match(/^#\d+\s+(.*)$/)).map(i => i.match(/^#\d+\s+(.*)$/)[1])
          if (list.filter(i => path.parse(i).name.match(/,\d+$/)).length) {
            return require('./install_inno_with_type')(from, to, excludes)
          } else {
            return require('./install_inno')(from, to, excludes)
          }
        }
      }
      // binaries
    } else if (files.filter(i => i.name === '!File').length) {
      return require('./install_msi')(from, to, excludes)
    } else if (files.filter(i => i.name.match(/app-64\.7z$/i)).length) {
      return require('./install_zipped')(from, to, 'install', 'app-64.7z')
    } else if (files.filter(i => i.name.match(/app-32\.7z$/i)).length) {
      return require('./install_zipped')(from, to, 'install', 'app-32.7z')
    } else if (files.filter(i => i.name.match(/full\.nupkg$/i)).length) {
      return require('./install_zipped')(from, to, 'install', 'full.nupkg', null, 'lib\\net45')
    } else if (files.filter(i => i.name.match(/^u\d*$/i)).length) {
      return require('./install_wix')(from, to, excludes)
    } else {
      return require('./install')(from, to, excludes)
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = install

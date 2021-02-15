<!-- TOC -->

- [软件更新管理器](#软件更新管理器)
    - [说明](#说明)
      - [使用方法](#使用方法)
      - [其他说明](#其他说明)
    - [命令行](#命令行)
    - [TODO](#todo)
    - [软件示例](#软件示例)
      - [简略版](#简略版)
        - [version](#version)
        - [download](#download)
        - [install](#install)
    - [支持的搜索站点](#支持的搜索站点)
    - [支持的软件](#支持的软件)
    - [特别的软件](#特别的软件)
        - [特殊的安装方式(作为参考)](#特殊的安装方式作为参考)
        - [缺少下载地址](#缺少下载地址)
        - [缺少安装方式](#缺少安装方式)

<!-- /TOC -->


## 软件更新管理器

[English ReadMe](README_en.md)

#### 说明

##### 使用方法

1. `git clone https://github.com/dodying/softwareUpdateManager`
2. `npm install`
3. 下载 `https://github.com/dodying/software-for-softwareUpdateManager/archive/master.zip`，
  解压并移动 **software** 到 **softwareUpdateManager** 下
4. 从[这里](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins)下载 **plugins.7z**，并解压到 **plugins** 下
5. 复制一份 **config.default.js**，按其中注释修改并存为 **config.js**
6. `node index.js`

##### 其他说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多，则可能以安装版优先)，同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion)， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动下载/安装**， 带 :pushpin: 的表示**安装目录固定**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试，如果自动安装失败，请尝试手动安装
7. 如果你想安装同个软件到多个地方，请在`config.js`中编辑`profile`，并使用`node index --profile`
8. 如果下载错误，请尝试挂代理下载


#### TODO
1. 针对软件的特定化设置
2. install_cli 变手动
  所有安装手动
3. version 去除 build
4. func-full => walkLink
5. software =>
https://stackoverflow.com/questions/10843572/how-to-create-javascript-constants-as-properties-of-objects-using-const-keyword
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
```js
  function Parser(){
    this.init.apply(this, arguments);
  }
  Parser.prototype = {
    constructor: Parser,
    get contentTxt() {  // callback 才有用
      var text = $('<div>').html(this.content).text().trim();

      // 解决第二个段落和第一个锻炼合在一起的问题
      text = text.replace(/([^\n])　　/, '$1\n　　');

      return text;
    },

    init: function (info, doc, curPageUrl) {}
  }
```
6. 依据特定方式直接安装指定版本的软件（当前为只能安装最新版本）
7. 无需下载software文件夹直接安装
8. 只有软件不存在时才安装（适用于不常更新/会自动更新的软件）

#### 软件示例

详见 [Vivaldi](software/Vivaldi.js)

##### 简略版

说明：主要简略 `version/download/install` 三个属性

###### version

function => `version: function`

string => `version: { selector: string }`

array => `version: { selector: array[0], attr: array[1], match: array[2] }`

###### download

any => array `[].concat(any)`

`typeof array[0] === 'string'` and `array[0].match(/^https?:/i)` => { plain: array[0], output: array[1] }

`typeof array[0] === 'string'` and not `array[0].match(/^https?:/i)` => { selector: array[0], attr: array[1], match: array[2], output: array[3] }

`typeof array[0] === 'function'` => { func: array[0], output: array[1] }

###### install

array => (array[0])(output, iPath, ...array[1,])


#### 支持的搜索站点

{search}


#### 支持的软件

详见 [SupportedSoftwares.md](SupportedSoftwares.md)

#### 特别的软件

###### 特殊的安装方式(作为参考)

{software-special-installer}

###### 缺少下载地址

{software-without-download}

###### 缺少安装方式

{software-without-installer}

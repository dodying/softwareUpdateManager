<!-- TOC -->

- [SoftwareUpdateManager](#softwareupdatemanager)
  - [软件更新管理器](#软件更新管理器)
    - [Usage](#usage)
      - [使用说明](#使用说明)
    - [Software Example](#software-example)
      - [软件示例](#软件示例)
    - [Priority of Some Config](#priority-of-some-config)
      - [一些设置的优先级](#一些设置的优先级)
    - [Note](#note)
      - [说明](#说明)
    - [Supported Software](#supported-software)
      - [支持的软件](#支持的软件)

<!-- /TOC -->

# SoftwareUpdateManager
## 软件更新管理器

### Usage
#### 使用说明

0. 使用前，请先复制一份`config.js`，并按其中注释修改
1. `node index.js 7z AIMP`
  检查并更新这些软件(多个软件用`空格`间隔) (忽略更新间隔)
2. `node index.js -filter abc`
  检查并更新路径匹配的软件(多个匹配条件用`,`相隔) (忽略更新间隔)
3. `node index.js -onlycheck`
  获取网上软件的最新版本号，并写入`database.json` (忽略更新间隔)
  效果: 忽略当前最新版本
4. `node index.js -list`
  列出`database.json`中的软件及版本
5. `node index.js -makemd`
  根据`software`文件夹下的`js`文件创建`README.md`


### Software Example
#### 软件示例

请参照`software\Telegram.js`
```js
{example}
```

### Priority of Some Config
#### 一些设置的优先级

1. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
2. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`


### Note
#### 说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先，同时64位优先
2. 大多软件都支持自动安装
3. 带 :moneybag: 的为**商业软件**， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动安装**
4. 这些站点默认视作 :airplane: : [SourceForge](https://sourceforge.net), [Github](https://github.com)

### Supported Software
#### 支持的软件

{software}

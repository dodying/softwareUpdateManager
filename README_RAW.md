<!-- TOC -->

- [SoftwareUpdateManager](#softwareupdatemanager)
  - [软件更新管理器](#软件更新管理器)
    - [Note](#note)
      - [说明](#说明)
        - [使用方法](#使用方法)
        - [其他说明](#其他说明)
    - [Command-Line](#command-line)
      - [命令行](#命令行)
    - [TODO](#todo)
    - [Software Example](#software-example)
      - [软件示例](#软件示例)
    - [Supported Software](#supported-software)
      - [支持的软件](#支持的软件)
    - [Special Software](#special-software)
      - [特别的软件](#特别的软件)
        - [Special Installer](#special-installer)
          - [特殊的安装方式(作为参考)](#特殊的安装方式作为参考)
        - [Without Download](#without-download)
          - [缺失下载](#缺失下载)
        - [Without Installer](#without-installer)
          - [缺失安装方式](#缺失安装方式)
        - [Extractable Software](#extractable-software)
          - [可以解包的软件](#可以解包的软件)

<!-- /TOC -->

# SoftwareUpdateManager
## 软件更新管理器

### Note
#### 说明

##### 使用方法

1. git clone
2. 从[这里](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins)下载 **plugins.7z**，并解压到 **plugins** 下
3. 复制一份`config.default.js`，按其中注释修改并存为`config.js`

##### 其他说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多，则可能以安装版优先)，同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion)， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动安装**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`


### Command-Line
#### 命令行

* `-makemd`
* `-help`
* `[-profile=name] -list`
* `[-quiet-mode] [-profile=name] [-filter filter_with_comma ] [ -test | -onlycheck | -backup | -install ]`
* `[-quiet-mode] [-profile=name] [ -test | -onlycheck | -backup | -install ] [software_name]`

<details>
  <summary>Command-Line Details</summary>

* node index

   `node index.js`
    检查并更新所有软件
* help

    `node index.js -help`
* makemd

    `node index.js -makemd`
    根据`software`文件夹下的`js`文件创建`README.md`
* profile

    `node index.js -profile=profile_name`
    eg: `node index.js -profile=sync`
        ==> 当`config`与`config.profile.sync`中存在相同项时，以`config.profile.sync`优先，同时数据会保存在`data-sync.json`中
* list

    `node index.js -list`
    列出`database.json`中的软件及版本
* quiet-mode

    `node index.js -quiet-mode`
    所有的提问为false或0(第一项)
* filter

    `node index.js -filter filter_with_comma`
    检查并更新匹配的软件(多个匹配条件用`,`相隔) (忽略更新间隔)
* test

    `node index.js -test`
    获取网上所有软件的最新版本号 (忽略更新间隔)
* onlycheck

    `node index.js -onlycheck`
    获取网上软件的最新版本号，并写入`database.json` (忽略更新间隔)
    效果: 忽略本地版本
* backup

    `node index.js -backup`
    获取网上软件的最新版本，并下载安装包 (忽略更新间隔)
* install

    `node index.js -install`
    安装本地最新版本
* software_name

    `node index.js 7-Zip AIMP "Google Chrome"`
    检查并更新这些软件(多个软件用`空格`相隔) (忽略更新间隔)
</details>

### TODO

* [ ] 支持同一软件的不同版本
* [ ] 从 [FileHorse.com](http://www.filehorse.com/) 等网站搜索并生成相应js
* [ ] 自动检查安装包类型并安装

### Software Example
#### 软件示例

请参照 [Telegram](software/Telegram.js)
<details>
  <summary>Example Details</summary>

```js
{example}
```
</details>


### Supported Software
#### 支持的软件

<details>
  <summary>Software List Details</summary>

{software}
</details>

### Special Software
#### 特别的软件

##### Special Installer
###### 特殊的安装方式(作为参考)

{software-special-installer}

##### Without Download
###### 缺失下载

{software-without-download}

##### Without Installer
###### 缺失安装方式

{software-without-installer}

##### Extractable Software
###### 可以解包的软件

1. 以下软件的安装包使用 [Advanced Installer](https://www.advancedinstaller.com/) 打包
  可以使用参数 `/extract <path>` 来提取，查看[更多信息](https://www.advancedinstaller.com/user-guide/exe-setup-file.html)

    `RaiDrive`

2. `Evernote` 是使用MSI打包的, 你可以从 `%temp%\Evernote.msi` 获得安装包

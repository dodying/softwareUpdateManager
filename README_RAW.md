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
    - [Supported Search Site](#supported-search-site)
      - [支持的搜索站点](#支持的搜索站点)
    - [Supported Software](#supported-software)
      - [支持的软件](#支持的软件)
    - [Special Software](#special-software)
      - [特别的软件](#特别的软件)
        - [Special Installer](#special-installer)
          - [特殊的安装方式(作为参考)](#特殊的安装方式作为参考)
        - [Without Download](#without-download)
          - [缺少下载地址](#缺少下载地址)
        - [Without Installer](#without-installer)
          - [缺少安装方式](#缺少安装方式)

<!-- /TOC -->

# SoftwareUpdateManager
## 软件更新管理器

### Note
#### 说明

##### 使用方法

1. `git clone https://github.com/dodying/softwareUpdateManager`
2. `npm install`
3. `git clone https://github.com/dodying/software-for-softwareUpdateManager`
  并移动 **software** 到 **softwareUpdateManager** 下
4. 从[这里](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins)下载 **plugins.7z**，并解压到 **plugins** 下
5. 复制一份 **config.default.js**，按其中注释修改并存为 **config.js**

##### 其他说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多，则可能以安装版优先)，同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion)， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动下载/安装**， 带 :pushpin: 的表示**安装目录固定**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试，如果自动安装失败，请尝试手动安装


### Command-Line
#### 命令行

* `--help`
* `--makemd`
* `--search keyword`
* `[--profile name] --list`
* `[--quiet] [--profile name] [--filter name] [ --test | --test-download | --test-install | --check | --backup | --install ]`
* `[--quiet] [--profile name] [ --test | --test-download | --test-install | --check | --backup | --install ] [name]`

<details>
  <summary>Command-Line Details</summary>

* `node index`

   `node index.js`
    检查并更新所有软件
* `--help`, `-h`

    `node index.js --help`
* `--makemd`, `-md`

    `node index.js --makemd`
    根据`software`文件夹下的`js`文件创建`README.md`
* `--search`, `-s`

    `node index.js --search keyword`
    搜索并创建`js`文件
* `--profile`, `-p`

    `node index.js --profile name`
    eg: `node index.js -profile sync`
        ==> 当`config`与`config.profile.sync`中存在相同项时，以`config.profile.sync`优先，同时数据会保存在`data-sync.json`中
* `--list`, `-l`

    `node index.js --list`
    列出`database.json`中的软件及版本
* `--quiet`, `-q`

    `node index.js --quiet`
    所有的提问为false或0(第一项)
* `--filter`, `-f`

    `node index.js --filter name`
    检查并更新匹配的软件(多个匹配条件用`,`相隔) (忽略更新间隔)
* `--test`, `-t`

    `node index.js --test`
    获取网上所有软件的最新版本号 (忽略更新间隔)
* `--test-download`, `-td`

    `node index.js --test-download`
    获取网上所有软件的最新版本号，并下载 (使用 profile test)
* `--test-download`, `-ti`

    `node index.js --test-install`
    获取网上所有软件的最新版本号，并下载安装 (使用 profile test)
* `--check`, `-c`

    `node index.js --check`
    获取网上软件的最新版本号，并写入`database.json` (忽略更新间隔)
    效果: 忽略本地版本
* `--backup`, `-b`

    `node index.js --backup`
    获取网上软件的最新版本，并下载安装包 (忽略更新间隔)
* `--install`, `-i`

    `node index.js --install`
    安装本地最新版本
* `software_name`

    `node index.js 7-Zip AIMP "Google Chrome"`
    检查并更新这些软件(多个软件用`空格`相隔) (忽略更新间隔)
</details>


### TODO

* [x] 支持同一软件的不同版本
* [x] 从 [FileHorse.com](http://www.filehorse.com/) 等网站搜索并生成相应js
* [x] 自动检查安装包类型并安装
* [ ] Request模式下，检查文件是否完整


### Software Example
#### 软件示例

请参照 [Telegram](software/Telegram.js)
<details>
  <summary>Example Details</summary>

```js
{example}
```
</details>


### Supported Search Site
#### 支持的搜索站点

{search}


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
###### 缺少下载地址

{software-without-download}

##### Without Installer
###### 缺少安装方式

{software-without-installer}

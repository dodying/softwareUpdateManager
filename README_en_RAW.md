<!-- TOC -->

- [SoftwareUpdateManager](#softwareupdatemanager)
    - [Note](#note)
      - [Usage](#usage)
      - [Other](#other)
    - [Command-Line](#command-line)
    - [TODO](#todo)
    - [Software Example](#software-example)
    - [Supported Search Site](#supported-search-site)
    - [Supported Software](#supported-software)
    - [Special Software](#special-software)
        - [Special Installer](#special-installer)
        - [Without Download](#without-download)
        - [Without Installer](#without-installer)

<!-- /TOC -->

## SoftwareUpdateManager

[中文说明](README.md)

#### Note

##### Usage

1. `git clone https://github.com/dodying/softwareUpdateManager`
2. `npm install`
3. Download `https://github.com/dodying/software-for-softwareUpdateManager/archive/master.zip`,
  extract and move **software** to under **softwareUpdateManager**
4. Download **plugins.7z** from [here](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins), and extract to **plugins**
5. Copy **config.default.js**, modify and save as **config.js**
6. `node index.js`

##### Other

1. 以下软件, 如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多, 则可能以安装版优先), 同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion),  带 :airplane: 的需**番羽土墙**,  带 :hand: 的需**手动下载/安装**,  带 :pushpin: 的表示**安装目录固定**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试, 如果自动安装失败, 请尝试手动安装
7. 如果你想安装同个软件到多个地方，请在`config.js`中编辑`profile`，并使用`node index --profile`

#### Command-Line

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
    check and update all softwares
* `--help`, `-h`

    `node index.js --help`
* `--makemd`, `-md`

    `node index.js --makemd`
    update `README.md`
* `--search`, `-s`

    `node index.js --search keyword`
    search and create `js` file
* `--profile`, `-p`

    `node index.js --profile name`
    eg: `node index.js -profile sync`
        ==> 当`config`与`config.profile.sync`中存在相同项时, 以`config.profile.sync`优先, 同时数据会保存在`data-sync.json`中
* `--list`, `-l`

    `node index.js --list`
    list software saved in`database.json`
* `--quiet`, `-q`

    `node index.js --quiet`
    passive mode
* `--filter`, `-f`

    `node index.js --filter name`
    check these softwares (seperated by`,`) (ignore check interval)
* `--test`, `-t`

    `node index.js --test`
    check latest version (ignore check interval)
* `--test-download`, `-td`

    `node index.js --test-download`
    check latest version, and download (use profile test)
* `--test-download`, `-ti`

    `node index.js --test-install`
    check latest version, download and install (use profile test)
* `--check`, `-c`

    `node index.js --check`
    check latest version and save into `database.json` (ignore check interval)
* `--backup`, `-b`

    `node index.js --backup`
    get latest version of software installer (ignore check interval)
* `--install`, `-i`

    `node index.js --install`
    install the latest version you download before
* `software_name`

    `node index.js 7-Zip AIMP "Google Chrome"`
     check these softwares (seperated by `space`) (ignore check interval)
</details>


#### TODO


#### Software Example

Refer to [Vivaldi](software/Vivaldi.js)

#### Supported Search Site

{search}


#### Supported Software

Refer to [SupportedSoftwares.md](SupportedSoftwares.md)

#### Special Software

###### Special Installer

{software-special-installer}

###### Without Download

{software-without-download}

###### Without Installer

{software-without-installer}

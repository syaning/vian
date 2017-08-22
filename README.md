# vian

[![node](https://img.shields.io/node/v/vian.svg)](https://nodejs.org/en/)
[![npm](https://img.shields.io/npm/v/vian.svg)](https://www.npmjs.com/package/vian)
![license](https://img.shields.io/github/license/syaning/vian.svg)

Web page screenshot tool. Powered by [puppeteer](https://github.com/GoogleChrome/puppeteer).

### Install

```sh
$ npm install -g vian
```

### Usage

```sh
$ vian

  Usage: vian [options] <url>


  Options:

    -V, --version               output the version number
    -d, --device <device>       use device
    --no-fullpage               no fullpage
    -f, --file <filename>       output file name
    -t, --type <filetype>       output file type: png, jpg, jpeg or pdf
    -s, --page-size <pagesize>  pdf page size, default A4
    -v, --viewport <viewport>   viewport, default 1440x900
    -h, --help                  output usage information


  Commands:

    devices     list all available devices
    pagesizes   list all pdf page sizes

  Examples:

    $ vian https://github.com
    $ vian -d 'iPhone 6' https://github.com
    $ vian -v 1366x768 https://github.com
    $ vian -f github.pdf -s A4 https://github.com
```

### License

[MIT](./LICENSE)

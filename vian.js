#!/usr/bin/env node

const url = require('url')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const pagesizes = require('./page-sizes')
const { version } = require('./package.json')

const devicesNames = devices.reduce((ret, device) => {
  ret[device.name] = true
  return ret
}, {})
const types = ['png', 'jpg', 'jpeg', 'pdf']
const validFileType = type => types.indexOf(type) >= 0

program
  .version(version)
  .usage('[options] <url>')
  .option('-d, --device <device>', 'use device')
  .option('--no-fullpage', 'no fullpage')
  .option('-f, --file <filename>', 'output file name')
  .option('-t, --type <filetype>', 'output file type: png, jpg, jpeg or pdf', 'png')
  .option('-s, --page-size <pagesize>', 'pdf page size, default A4', 'A4')
  .option('-v, --viewport <viewport>', 'viewport, default 1440x900', '1440x900')

program
  .command('devices')
  .description('list all available devices')
  .action(() => {
    devices.forEach(device => {
      const viewport = device.viewport
      const width = chalk.green(viewport.width)
      const height = chalk.green(viewport.height)
      console.log(`${device.name}  [${width}x${height}]`)
    })
    process.exit(0)
  })

program
  .command('pagesizes')
  .description('list all pdf page sizes')
  .action(() => {
    Object.keys(pagesizes).forEach(pagesize => {
      const size = pagesizes[pagesize]
      const width = chalk.green(size[0])
      const height = chalk.green(size[1])
      console.log(`${pagesize}\t[${width} x ${height}]`)
    })
    process.exit(0)
  })

program.on('--help', function() {
  const examples = `
  Examples:

    $ vian https://github.com
    $ vian -d 'iPhone 6' https://github.com
    $ vian -v 1366x768 https://github.com
    $ vian -f github.pdf -s A4 https://github.com
  `

  console.log(examples)
})

program.parse(process.argv)

if (program.rawArgs.length <= 2) {
  return program.help()
}

if (!program.args.length) {
  return console.log('No url specified')
}

// device
if (program.device && !devicesNames[program.device]) {
  return console.log(`Unknown device name '${program.device}'`)
}

// output filename
if (program.file) {
  const ext = path.extname(program.file).slice(1)
  if (!validFileType(ext)) {
    return console.log(`Unsupport file type '${ext}'`)
  }
  program.type = ext
  program.file = path.resolve(process.cwd(), program.file)
} else {
  if (!validFileType(program.type)) {
    return console.log(`Unsupport file type '${program.type}'`)
  }
  program.file = `vian-${Date.now()}.${program.type}`
}

// pdf page size
if (program.type === 'pdf') {
  if (!pagesizes[program.pageSize]) {
    return console.log(`Unknown page size '${program.pageSize}'`)
  }
}

// viewport
const viewportErr = `Invalid viewport '${program.viewport}'`
try {
  let [width, height] = program.viewport.split('x')
  width = parseInt(width)
  height = parseInt(height)
  if (isNaN(width) || isNaN(height)) {
    return console.log(viewportErr)
  }
  program.viewport = { width, height }
} catch (e) {
  return console.log(viewportErr)
}

const target = url.parse(program.args[0])
if (!target.hostname) {
  return console.log(`Invalid url ${program.args[0]}`)
}

async function vian() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  if (program.device) {
    await page.emulate(devices[program.device])
  } else if (program.viewport) {
    await page.setViewport(program.viewport)
  }

  await page.goto(program.args[0])

  if (program.type === 'pdf') {
    await page.pdf({ path: program.file, format: program.pageSize })
  } else {
    await page.screenshot({ path: program.file, fullPage: program.fullpage })
  }

  browser.close()
}

vian()

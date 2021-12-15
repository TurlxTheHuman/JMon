var osu = require('node-os-utils')
let ut = require("ui-terminal")
var asciichart = require('asciichart')
const config = require('./config.json')


var netstat = osu.netstat
var cpu = osu.cpu
var mem = osu.mem

function networkusage() {
    netstat.inOut()
        .then(info => {
            console.log(info)
        })
}

var chart = {

  offset:  3, 
  padding: '          ',
  height:  4,


    colors: [
        asciichart.blue,
        asciichart.green,
        asciichart.default,
        undefined,
    ]
}

cpuarray = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
ramarray = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']

netinarray = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
netoutarray = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']

var lastchanged = '0'
var cpuusage = '0'
var ramusage = '0'
var netin = '0'
var netout = '0'

function graph() {
    console.clear();

    cpu.usage().then(cpuPercentage => {
        cpuusage = Math.round(cpuPercentage)
    })

    mem.info()
        .then(info => {
            ramusage = Math.round(100 - info.freeMemPercentage)
        })

    netstat.inOut()
        .then(info => {
          netin = info[config.interface].inputMb*8
          netout = info[config.interface].outputMb*8
        })

    if (lastchanged < config.dataamount) {
        cpuarray[lastchanged] = cpuusage
        ramarray[lastchanged] = ramusage

        netinarray[lastchanged] = netin
        netoutarray[lastchanged] = netout

        console.log(`${ut.incyan("CPU Usage")} \n${ut.ingreen("RAM Usage")}`)
        console.log(asciichart.plot([cpuarray, ramarray], chart))
        console.log('\n\n\n\n')
        console.log(`${ut.incyan("Inbound Traffic")} \n${ut.ingreen("Outbound Traffic")}`)
        console.log(asciichart.plot([netinarray, netoutarray], chart))
        lastchanged++
    } else {
        cpuarray.shift();
        cpuarray.push(cpuusage)
        ramarray.shift()
        ramarray.push(ramusage)

        netinarray.shift()
        netinarray.push(netin)
        netoutarray.shift()
        netoutarray.push(netout)

        console.log(`${ut.incyan("CPU Usage")} \n${ut.ingreen("RAM Usage")}`)
        console.log(asciichart.plot([cpuarray, ramarray], chart))
        console.log('\n\n\n\n')
        console.log(`${ut.incyan("Inbound Traffic")} \n${ut.ingreen("Outbound Traffic")}`)
        console.log(asciichart.plot([netinarray, netoutarray], chart))
        lastchanged++
    }
}

async function loop() {
    graph()
    setTimeout(loop, 1000);
}
loop()
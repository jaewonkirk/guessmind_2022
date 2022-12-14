const {SerialPort, InterByteTimeoutParser} = require("serialport");

const portIdx = [];
const serialports = [];
const parsers = [];
const buffers = [];
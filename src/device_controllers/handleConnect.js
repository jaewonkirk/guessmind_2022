import {SerialPort, InterByteTimeoutParser} from "serialport";
import {serialports, parsers, buffer} from "../server";

const PARSERTIMEOUT = 50; //milliseconds
const handleConnect = (comParam) => {
    let portNum = -1;
    serialports.forEach((serialport, idx) => {
        if(serialport.settings.path == comParam.path){
            portNum = idx;
        }
    });
    if(portNum == -1){
        serialports.push(new SerialPort({
            path: comParam.path,
            baudRate: Number(comParam.baudRate),
            dataBits: Number(comParam.dataBits) | 8,
            stopBits: Number(comParam.stopBits) | 1,
        }));
        parsers.push(new InterByteTimeoutParser({interval:PARSERTIMEOUT}))
        serialports[0].pipe(parsers[0]);
        parsers[0].on("data", (line) => {buffer.push({port: comParam.path, response: `${line}`}); console.log(buffer);});
        return {state: "new port established", path: comParam.path, portIndex: serialports.length-1};
    } else {
        return {state: "port already opened", path: comParam.path, portIndex: portNum};
    }
}

export default handleConnect;
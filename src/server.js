import express from "express";
import socketIO from "socket.io";
import getPortList from "./device_controllers/getPortList";
import handleConnect from "./device_controllers/handleConnect";
import {SerialPort, InterByteTimeoutParser} from "serialport";

export const serialports = [];
export const parsers = [];
export const buffer = [];

/*
serialports.push(new SerialPort({
    path: "COM8",
    baudRate: 38400,
}));

parsers.push(new InterByteTimeoutParser({interval:100}))

serialports[0].pipe(parsers[0]);

parsers[0].on("data", (line) => {buffer.push(`${line}`); console.log(buffer);});

serialports[0].write(":0703047162716200\r\n");
*/
const PORT = 3000;
const app = express();
app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");

app.use(express.static(process.cwd()+"/src/static"))

app.get("/", getPortList, (req, res) => {res.render("home", {
    portList : req.data.portList,
    baudrateList : [600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200, 230400, 460800, 921600],
    databitsList : [5, 6, 7, 8],
    parityList : ["Even", "Odd", "None", "Mark", "Space"],
    stopbitsList : [1, 1.5, 2],
    flowControlList : ["Xon/Xoff", "RTS/CTS", "None"]
});});

const handleListening = () => {console.log(`✅Server is running: https://localhost/${PORT}`)}

const server = app.listen(PORT, handleListening);

const io = socketIO(server);

io.on("connection", (socket) => {
    socket.on("newMessage", (data) => {
        console.log(data.message);
        //serialports[0].write(data.message);
        switch(data.message.request){
            case "connect":
                const comParam = {path: data.message.port,
                                  baudRate: data.message.baudrate,
                                  dataBits: data.message.databits,
                                  stopBits: data.message.stopbits
                    }
                const result = handleConnect(comParam);
                console.log(result);
                socket.emit("newMessage", {message:result});
                break;
            case "newSetpoint":
                //port 매치 생략
                const newSetpoint = 320*data.message.setpoint;
                serialports[0].write(":0680010121"+newSetpoint.toString(16)+"\r\n");
                break;
            case "readMFCState":
                serialports[0].write(":0A80048121012101210120\r\n");
                break;
            case "directSerial":
                break;
        }
    })
    setInterval(() => {
        if(buffer.length>0){
            socket.emit("newMessage", {message: buffer.pop()});
        }
    }, 100)
});

import { autoDetect } from '@serialport/bindings-cpp';
const newGetPortList = async () => {
    const portList = await autoDetect().list();
    return portList;
};
console.log(newGetPortList());
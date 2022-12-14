import { SerialPort } from "serialport";

const getPortList = async (req, res, next) => {
    const portList = await SerialPort.list();
    //console.log(portList);
    if(req.data===undefined){req.data={};}
    req.data.portList = portList;
    next();
}

export default getPortList;
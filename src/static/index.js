const socket = io("/");

socket.on("newMessage", (data) => {
    console.log(data);
    if(data.message.state == "MFCState"){
        document.querySelector(".sv-monitor").innerText = data.message.setpoint;
        document.querySelector(".pv-monitor").innerText = data.message.measure;
    }
})

function sendMessage(message){
    socket.emit("newMessage",{message});
}

const portsetting = document.querySelector("#port-setting");

function handleConnectBtnClick(event) {
    event.preventDefault();
    const formData = new FormData(portsetting);
    const sendData = {request: "connect",
                      port: formData.get("port"),
                      baudrate: formData.get("baudrate"),
                      databits: formData.get("data-bits"),
                      parity: formData.get("parity"),
                      stopbits: formData.get("stop-bits"),
                      flowcontrol: formData.get("flow-control")
    };
    sendMessage(sendData);
};

portsetting.addEventListener("submit", handleConnectBtnClick);

const comterminal = document.querySelector("#com-terminal");

function handleSendBtnClick(event) {
    event.preventDefault();
    const formData = new FormData(comterminal);
    const sendData = {request: "directSerial",
                      port: "COM8",
                      string: formData.get("tx-msg")
    };
    sendMessage(sendData);
};

comterminal.addEventListener("submit", handleSendBtnClick);

const MFCterminal = document.querySelector("#MFC-terminal");

function sendSetpoint(event){
    event.preventDefault();
    const formData = new FormData(MFCterminal);
    const sendData = {request: "newSetpoint",
                      port: "COM8",
                      setpoint: formData.get("setpoint")
                    };
    sendMessage(sendData);
};

MFCterminal.addEventListener("submit", sendSetpoint);

const MFCmonitor = document.querySelector("#MFC-monitor");

function readMFCstate(event){
    event.preventDefault();
    const sendData = {request: "readMFCState",
                      port: "COM8"
                    };
    sendMessage(sendData);
};

MFCmonitor.addEventListener("submit", readMFCstate);
class Network {
    constructor() {
        this.traffic = [];
    }
    sendRequest(packet) {
        const des = packet.url;
        if (url === "/client/") {
            Server.receiveRequest(packet);
        }
        else {
            return packet;
        }
    }
}

class Packet {
    constructor(url, content, method) {
        this._url = url;
        this._content = content;
        this._method = method;
        this._textResponse = undefined;
        this._statusCode = undefined;
    }
}
export class Network {
    constructor() {
        this.traffic = [];
    }
    sendRequest(packet) {
        if (url === "/client/") {
            return packet;
        }
        else {
            return Server.receiveRequest(packet);
        }
    }
}
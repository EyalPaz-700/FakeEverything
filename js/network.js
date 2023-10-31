export class Network {
    constructor() {
        this.traffic = [];
    }
    sendRequest(packet) {
        const des = packet.url;
        if (url === "/client/") {
            return packet;
        }
        else {
            Server.receiveRequest(packet);
        }
    }
}
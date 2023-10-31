import { server as Server } from "./server.js";


export const Network =  {
    traffic : [],
    sendRequest : function(packet) {
        if (packet._url === "/client/") {
            return packet;
        }
        else {
            Server.receiveRequest(packet);
        }
    }
}
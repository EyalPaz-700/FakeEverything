import { server as Server } from "./server.js";


export const Network = {
    traffic: [],
    sendRequest: function (packet, FjaxObj = undefined, trafficId = undefined) {
        if (packet._url === "/client/") {
            if (packet._statusCode === "200 OK") {
                // setTimeout(() => {
                //     this.traffic[trafficId].recieve(packet);
                // },500)
                this.traffic[trafficId].recieve(packet);
            }
            else {
                alert("404 NOT FOUND")
            }
        }
        else {
            this.traffic.push(FjaxObj)
            Server.receiveRequest(packet, this.traffic.length - 1);
        }
    }
}
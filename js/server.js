import { Packet } from "./packet.js"
import * as db from "./DB.js"

const fullTablePattern = /^\/api\/(users|plants)$/
const singleItemPattern = /^\/api\/(users|plants)\/\d+$/

export const server = {
    receiveRequest: function (packet) {
        const table = packet._url.split('/')[2]
        const content = JSON.parse(packet._content)
        let responseText;
        if (fullTablePattern.test(packet._url)) {
            if (packet._method === "GET") {
                responseText = db.getAll(table)
            }
            if (packet._method === "POST") {
                if (content.value) {
                    responseText = db.getAllMatches(table, content.value, content.prop);
                }
                else if (content.pageNum) {
                    responseText = db.getPage(content.pageNum);
                }
                else {
                    responseText = db.addItem(table, content);
                }
            }
        }
        else if (singleItemPattern.test(packet._url)) {
            const id = packet._url.split('/')[3]
            if (packet._method === "GET") {
                responseText = db.getItem(table, id)
            }
            if (packet._method === "PUT") {
                if (content.attribute !== "plants") {
                    responseText = db.changeItemAttribute(table, id, content.attribute, content.value)
                }
                else {
                    responseText = db.addNewPlant(id, content.plant_id)
                }
            }

            if (packet._method === "DELETE") {
                responseText = db.deleteItem(table, id)
            }

            if (packet._method === "POST") {
                responseText = db.getItemProp(table, id, content.prop);
            }
        }

        return new Packet("/client/", packet._method, responseText)
    }

}
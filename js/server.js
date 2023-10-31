import { Packet } from "./packet.js"

const fullTablePattern = /^\/api\/(users|plants)$/
const singleItemPattern = /^\/api\/(users|plants)\/\d+$/

export const server = {
    recieveRequest : function(packet){
       const table = packet._url.split('/')[1]
       const content = JSON.parse(packet._content)
       let responseText;
       if (packet._url.test(fullTablePattern))  {
        if (packet._method === "GET"){
            responseText = db.getTable(table)
        }
        if (packet._method === "POST"){
            responseText = db.addUser(table, {
                username : content.username,
                password : content.password,
                plants : []
            })
        }
    }
        else if(packet._url.test(singleItemPattern)){
            const id = packet._url.split('/')[2]
            if (packet._method === "GET"){
                responseText = db.getItem(table,id)
            }
            if (packet._method === "PUT" ) {
               if (content.attribute !== "plants") {
                responseText = db.changeItemAttribute(table, id, content.attribute, content.value)}
                else{
                    responseText = db.addNewPlant(id,content.plant_id)
                }
            }

            if (packet._method === "DELETE"){
                responseText = db.deleteItem(table,id)
            }
            
        }
        
        return new Packet("/client/", packet._method , responseText)
    }
     
}

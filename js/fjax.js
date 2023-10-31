import { Network } from "./network.js"
import { Packet } from "./packet.js"

export class Fjax{
    constructor(){
        this._url = undefined
        this._method = undefined
        this._content = undefined
        this._response = undefined
        this._onload = undefined
    }
    open(url,method){
        this._url = url
        this._method = method
    }
    send(content = ""){
        if ( (!content && (this._method === "PUT" || this._method == "GET") ) || (content && (this._method === "POST" || this._method === "PUT" ))){
            const packet = new Packet(this._url, this._method, JSON.stringify(content))
            this._response = Network.sendRequest(packet)
            if (this._onload){
             this._onload.call(this)
            }
        }
    }
    set onload(f){
        this._onload = f
    }
}
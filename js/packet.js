export class Packet {
    constructor(url, method, content = undefined) {
        debugger
        this._url = url;
        this._content = content;
        this._method = method;
        this._textResponse = undefined;
        this._statusCode = undefined;
    }
}
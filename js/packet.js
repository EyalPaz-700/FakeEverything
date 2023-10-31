export class Packet {
    constructor(url, method, content = undefined) {
        this._url = url;
        this._content = content;
        this._method = method;
        this._textResponse = undefined;
        this._statusCode = undefined;
    }
}
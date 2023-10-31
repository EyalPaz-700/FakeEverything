class Packet {
    constructor(url, content, method) {
        this._url = url;
        this._content = content;
        this._method = method;
        this._textResponse = undefined;
        this._statusCode = undefined;
    }
}
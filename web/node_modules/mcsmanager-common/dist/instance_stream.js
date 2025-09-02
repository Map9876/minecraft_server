"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Application instance data stream forwarding adapter
class InstanceStreamListener {
    constructor() {
        this.listenMap = new Map();
    }
    requestForward(socket, instanceUuid) {
        if (this.listenMap.has(instanceUuid)) {
            const sockets = this.listenMap.get(instanceUuid);
            if (!sockets)
                return;
            for (const iterator of sockets)
                if (iterator.id === socket.id)
                    throw new Error(`This Socket ${socket.id} already exists in the specified instance listening table`);
            sockets.push(socket);
        }
        else {
            this.listenMap.set(instanceUuid, [socket]);
        }
    }
    cannelForward(socket, instanceUuid) {
        if (!this.listenMap.has(instanceUuid))
            throw new Error(`The specified ${instanceUuid} does not exist in the listening table`);
        const socketList = this.listenMap.get(instanceUuid);
        socketList === null || socketList === void 0 ? void 0 : socketList.forEach((v, index) => {
            if (v.id === socket.id)
                socketList === null || socketList === void 0 ? void 0 : socketList.splice(index, 1);
        });
    }
    forward(instanceUuid, data) {
        const sockets = this.listenMap.get(instanceUuid);
        sockets === null || sockets === void 0 ? void 0 : sockets.forEach((socket) => {
            if (socket && socket.connected)
                socket.emit("instance/stdout", data);
        });
    }
    forwardViaCallback(instanceUuid, callback) {
        if (this.listenMap.has(instanceUuid)) {
            const sockets = this.listenMap.get(instanceUuid);
            sockets === null || sockets === void 0 ? void 0 : sockets.forEach((socket) => {
                if (socket && socket.connected)
                    callback(socket);
            });
        }
    }
    hasListenInstance(instanceUuid) {
        var _a;
        return this.listenMap.has(instanceUuid) && ((_a = this.listenMap) === null || _a === void 0 ? void 0 : _a.get(instanceUuid).length) > 0;
    }
}
exports.default = InstanceStreamListener;
//# sourceMappingURL=instance_stream.js.map
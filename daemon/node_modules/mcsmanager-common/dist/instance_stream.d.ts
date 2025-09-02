import { Socket } from "socket.io";
export default class InstanceStreamListener {
    readonly listenMap: Map<string, Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>[]>;
    constructor();
    requestForward(socket: Socket, instanceUuid: string): void;
    cannelForward(socket: Socket, instanceUuid: string): void;
    forward(instanceUuid: string, data: any): void;
    forwardViaCallback(instanceUuid: string, callback: (socket: Socket) => void): void;
    hasListenInstance(instanceUuid: string): boolean;
}

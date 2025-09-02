/// <reference types="node" />
import net from "net";
export interface MinecraftPingResponse {
    host: string;
    port: number;
    online: boolean;
    version: string;
    motd: string;
    current_players: number;
    max_players: number;
    latency: number;
}
export default class PingMinecraftServer {
    port: number;
    host: string;
    status: MinecraftPingResponse;
    client?: net.Socket;
    constructor(port: number, host: string);
    getStatus(): Promise<MinecraftPingResponse>;
    private destroy;
    asyncStatus(): Promise<MinecraftPingResponse>;
}

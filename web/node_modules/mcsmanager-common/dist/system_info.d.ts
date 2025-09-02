interface ISystemInfo {
    cpuUsage: number;
    memUsage: number;
    totalmem: number;
    freemem: number;
    type: string;
    hostname: string;
    platform: string;
    release: string;
    uptime: number;
    cwd: string;
    processCpu: number;
    processMem: number;
    loadavg: number[];
}
export declare function systemInfo(): ISystemInfo;
export {};

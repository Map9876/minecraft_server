/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess, SpawnOptionsWithoutStdio } from "child_process";
import EventEmitter from "events";
export declare class StartError extends Error {
}
export declare class ProcessWrapper extends EventEmitter {
    readonly file: string;
    readonly args: string[];
    readonly cwd: string;
    readonly timeout: number;
    readonly code: string;
    readonly option: SpawnOptionsWithoutStdio;
    process?: ChildProcess;
    pid?: number;
    errMsg: {
        timeoutErr: string;
        exitErr: string;
        startErr: string;
    };
    constructor(file: string, args: string[], cwd: string, timeout?: number, code?: string, option?: SpawnOptionsWithoutStdio);
    setErrMsg(errMsg: {
        timeoutErr: string;
        exitErr: string;
        startErr: string;
    }): void;
    start(): Promise<boolean>;
    getPid(): number | undefined;
    write(data?: any): boolean | undefined;
    kill(): void;
    status(): boolean;
    exitCode(): number | null | undefined;
    private destroy;
}
export declare function killProcess(pid: string | number, process: {
    kill(signal?: any): any;
}, signal?: any): any;

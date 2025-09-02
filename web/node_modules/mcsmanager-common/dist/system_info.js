"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemInfo = void 0;
const os_1 = __importDefault(require("os"));
const os_utils_1 = __importDefault(require("os-utils"));
const fs_1 = __importDefault(require("fs"));
// System details are updated every time
const info = {
    type: os_1.default.type(),
    hostname: os_1.default.hostname(),
    platform: os_1.default.platform(),
    release: os_1.default.release(),
    uptime: os_1.default.uptime(),
    cwd: process.cwd(),
    loadavg: os_1.default.loadavg(),
    freemem: 0,
    cpuUsage: 0,
    memUsage: 0,
    totalmem: 0,
    processCpu: 0,
    processMem: 0
};
// periodically refresh the cache
setInterval(() => {
    if (os_1.default.platform() === "linux") {
        return setLinuxSystemInfo();
    }
    if (os_1.default.platform() === "win32") {
        return setWindowsSystemInfo();
    }
    return otherSystemInfo();
}, 3000);
function otherSystemInfo() {
    info.freemem = os_1.default.freemem();
    info.totalmem = os_1.default.totalmem();
    info.memUsage = (os_1.default.totalmem() - os_1.default.freemem()) / os_1.default.totalmem();
    os_utils_1.default.cpuUsage((p) => (info.cpuUsage = p));
}
function setWindowsSystemInfo() {
    info.freemem = os_1.default.freemem();
    info.totalmem = os_1.default.totalmem();
    info.memUsage = (os_1.default.totalmem() - os_1.default.freemem()) / os_1.default.totalmem();
    os_utils_1.default.cpuUsage((p) => (info.cpuUsage = p));
}
function setLinuxSystemInfo() {
    var _a;
    try {
        // read memory data based on /proc/meminfo
        const data = fs_1.default.readFileSync("/proc/meminfo", { encoding: "utf-8" });
        const list = data.split("\n");
        const infoTable = {};
        list.forEach((line) => {
            const kv = line.split(":");
            if (kv.length === 2) {
                const k = kv[0].replace(/ /gim, "").replace(/\t/gim, "").trim().toLowerCase();
                let v = kv[1].replace(/ /gim, "").replace(/\t/gim, "").trim().toLowerCase();
                v = v.replace(/kb/gim, "").replace(/mb/gim, "").replace(/gb/gim, "");
                let vNumber = parseInt(v);
                if (isNaN(vNumber))
                    vNumber = 0;
                infoTable[k] = vNumber;
            }
        });
        const memAvailable = (_a = infoTable["memavailable"]) !== null && _a !== void 0 ? _a : infoTable["memfree"];
        const memTotal = infoTable["memtotal"];
        info.freemem = memAvailable * 1024;
        info.totalmem = memTotal * 1024;
        info.memUsage = (info.totalmem - info.freemem) / info.totalmem;
        os_utils_1.default.cpuUsage((p) => (info.cpuUsage = p));
    }
    catch (error) {
        // If the reading is wrong, the default general reading method is automatically used
        otherSystemInfo();
    }
}
function systemInfo() {
    return info;
}
exports.systemInfo = systemInfo;
//# sourceMappingURL=system_info.js.map
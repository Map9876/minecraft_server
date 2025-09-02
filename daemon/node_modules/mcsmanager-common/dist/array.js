"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayUnique = void 0;
function arrayUnique(arr, felidName) {
    if (!felidName)
        return Array.from(new Set(arr));
    const map = new Map();
    return arr.filter((v) => !map.has(v[felidName]) && map.set(v[felidName], v));
}
exports.arrayUnique = arrayUnique;
//# sourceMappingURL=array.js.map
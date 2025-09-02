"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlobalVariable {
    static set(k, v) {
        GlobalVariable.map.set(k, v);
    }
    static get(k, def) {
        if (GlobalVariable.map.has(k)) {
            return GlobalVariable.map.get(k);
        }
        else {
            return def;
        }
    }
    static del(k) {
        return GlobalVariable.map.delete(k);
    }
}
exports.default = GlobalVariable;
GlobalVariable.map = new Map();
//# sourceMappingURL=global_variable.js.map
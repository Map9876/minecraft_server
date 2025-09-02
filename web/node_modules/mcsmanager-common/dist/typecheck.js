"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supposeValue = exports.isEmpty = exports.toBoolean = exports.toNumber = exports.toText = exports.configureEntityParams = void 0;
function configureEntityParams(self, args, key, typeFn) {
    var _a;
    const selfDefaultValue = (_a = self[key]) !== null && _a !== void 0 ? _a : null;
    const v = args[key] != null ? args[key] : selfDefaultValue;
    if (typeFn === Number) {
        if (v === "" || v == null) {
            self[key] = null;
        }
        else {
            if (isNaN(Number(v)))
                throw new Error(`ConfigureEntityParams Error: Expected type to be Number, but got ${typeof v}`);
            self[key] = Number(v);
        }
        return;
    }
    if (typeFn === String) {
        if (v == null) {
            self[key] = null;
        }
        else {
            self[key] = String(v);
        }
        return;
    }
    if (typeFn === Boolean) {
        if (v == null) {
            self[key] = false;
        }
        else {
            self[key] = Boolean(v);
        }
        return;
    }
    if (typeFn) {
        self[key] = typeFn(v);
    }
    else {
        self[key] = v;
    }
}
exports.configureEntityParams = configureEntityParams;
function toText(v) {
    if (isEmpty(v))
        return null;
    return String(v);
}
exports.toText = toText;
function toNumber(v) {
    if (isEmpty(v))
        return null;
    if (isNaN(Number(v)))
        return null;
    return Number(v);
}
exports.toNumber = toNumber;
function toBoolean(v) {
    if (isEmpty(v))
        return null;
    return Boolean(v);
}
exports.toBoolean = toBoolean;
function isEmpty(v) {
    return v === null || v === undefined;
}
exports.isEmpty = isEmpty;
function supposeValue(v, def) {
    if (isEmpty(v))
        return def;
    return v;
}
exports.supposeValue = supposeValue;
//# sourceMappingURL=typecheck.js.map
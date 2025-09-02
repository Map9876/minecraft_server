"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrail = void 0;
function removeTrail(origin, trail) {
    if (origin.endsWith(trail)) {
        return origin.slice(0, origin.length - trail.length);
    }
    else {
        return origin;
    }
}
exports.removeTrail = removeTrail;
//# sourceMappingURL=string_utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFindByHookPayload = exports.isFindByDataPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
function isFindByDataPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Data && payload.method === types_1.Method.Find;
}
exports.isFindByDataPayload = isFindByDataPayload;
function isFindByHookPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Hook && payload.method === types_1.Method.Find;
}
exports.isFindByHookPayload = isFindByHookPayload;
//# sourceMappingURL=Find.js.map
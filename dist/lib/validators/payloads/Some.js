"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSomeByHookPayload = exports.isSomeByDataPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
function isSomeByDataPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Data && payload.method === types_1.Method.Some;
}
exports.isSomeByDataPayload = isSomeByDataPayload;
function isSomeByHookPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Hook && payload.method === types_1.Method.Some;
}
exports.isSomeByHookPayload = isSomeByHookPayload;
//# sourceMappingURL=Some.js.map
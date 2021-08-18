"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFilterByHookPayload = exports.isFilterByDataPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
function isFilterByDataPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Data && payload.method === types_1.Method.Filter;
}
exports.isFilterByDataPayload = isFilterByDataPayload;
function isFilterByHookPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Hook && payload.method === types_1.Method.Filter;
}
exports.isFilterByHookPayload = isFilterByHookPayload;
//# sourceMappingURL=Filter.js.map
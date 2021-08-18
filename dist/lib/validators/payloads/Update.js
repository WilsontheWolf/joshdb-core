"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUpdateByHookPayload = exports.isUpdateByDataPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
function isUpdateByDataPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Data && payload.method === types_1.Method.Update;
}
exports.isUpdateByDataPayload = isUpdateByDataPayload;
function isUpdateByHookPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Hook && payload.method === types_1.Method.Update;
}
exports.isUpdateByHookPayload = isUpdateByHookPayload;
//# sourceMappingURL=Update.js.map
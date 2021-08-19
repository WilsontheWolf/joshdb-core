"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUpdateByHookPayload = exports.isUpdateByDataPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Checks whether the given payload is a {@link UpdateByDataPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
function isUpdateByDataPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Data && payload.method === types_1.Method.Update;
}
exports.isUpdateByDataPayload = isUpdateByDataPayload;
/**
 * Checks whether the given payload is a {@link UpdateByHookPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
function isUpdateByHookPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Hook && payload.method === types_1.Method.Update;
}
exports.isUpdateByHookPayload = isUpdateByHookPayload;
//# sourceMappingURL=Update.js.map
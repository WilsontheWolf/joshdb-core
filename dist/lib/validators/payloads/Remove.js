"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRemoveByValuePayload = exports.isRemoveByHookPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Validates whether the given payload is {@link RemoveByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isRemoveByHookPayload(payload) {
    return payload.method === types_1.Method.Remove && payload.type === payloads_1.Payload.Type.Hook;
}
exports.isRemoveByHookPayload = isRemoveByHookPayload;
/**
 * Validates whether the given payload is {@link RemoveByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isRemoveByValuePayload(payload) {
    return payload.method === types_1.Method.Remove && payload.type === payloads_1.Payload.Type.Value;
}
exports.isRemoveByValuePayload = isRemoveByValuePayload;
//# sourceMappingURL=Remove.js.map
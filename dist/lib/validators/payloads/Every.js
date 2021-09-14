"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEveryByValuePayload = exports.isEveryByHookPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Validates whether the given payload is {@link EveryByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isEveryByHookPayload(payload) {
    return payload.method === types_1.Method.Every && payload.type === payloads_1.Payload.Type.Hook;
}
exports.isEveryByHookPayload = isEveryByHookPayload;
/**
 * Validates whether the given payload is {@link EveryByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isEveryByValuePayload(payload) {
    return payload.method === types_1.Method.Every && payload.type === payloads_1.Payload.Type.Value;
}
exports.isEveryByValuePayload = isEveryByValuePayload;
//# sourceMappingURL=Every.js.map
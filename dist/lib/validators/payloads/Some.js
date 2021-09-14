"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSomeByValuePayload = exports.isSomeByHookPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Validates whether the given payload is {@link SomeByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isSomeByHookPayload(payload) {
    return payload.method === types_1.Method.Some && payload.type === payloads_1.Payload.Type.Hook;
}
exports.isSomeByHookPayload = isSomeByHookPayload;
/**
 * Validates whether the given payload is {@link SomeByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isSomeByValuePayload(payload) {
    return payload.method === types_1.Method.Some && payload.type === payloads_1.Payload.Type.Value;
}
exports.isSomeByValuePayload = isSomeByValuePayload;
//# sourceMappingURL=Some.js.map
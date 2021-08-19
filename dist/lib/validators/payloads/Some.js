"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSomeByHookPayload = exports.isSomeByDataPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Checks whether the given payload is a {@link SomeByDataPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
function isSomeByDataPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Data && payload.method === types_1.Method.Some;
}
exports.isSomeByDataPayload = isSomeByDataPayload;
/**
 * Checks whether the given payload is a {@link SomeByHookPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
function isSomeByHookPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Hook && payload.method === types_1.Method.Some;
}
exports.isSomeByHookPayload = isSomeByHookPayload;
//# sourceMappingURL=Some.js.map
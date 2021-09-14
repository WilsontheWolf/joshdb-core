"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFilterByValuePayload = exports.isFilterByHookPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Validates whether the given payload is {@link FilterByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isFilterByHookPayload(payload) {
    return payload.method === types_1.Method.Filter && payload.type === payloads_1.Payload.Type.Hook;
}
exports.isFilterByHookPayload = isFilterByHookPayload;
/**
 * Validates whether the given payload is {@link FilterByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isFilterByValuePayload(payload) {
    return payload.method === types_1.Method.Filter && payload.type === payloads_1.Payload.Type.Value;
}
exports.isFilterByValuePayload = isFilterByValuePayload;
//# sourceMappingURL=Filter.js.map
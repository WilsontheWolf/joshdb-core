"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFilterByHookPayload = exports.isFilterByDataPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Checks whether the given payload is a {@link FilterByDataPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
function isFilterByDataPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Data && payload.method === types_1.Method.Filter;
}
exports.isFilterByDataPayload = isFilterByDataPayload;
/**
 * Checks whether the given payload is a {@link FilterByHookPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
function isFilterByHookPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Hook && payload.method === types_1.Method.Filter;
}
exports.isFilterByHookPayload = isFilterByHookPayload;
//# sourceMappingURL=Filter.js.map
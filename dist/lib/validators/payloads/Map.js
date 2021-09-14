"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMapByPathPayload = exports.isMapByHookPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Validates whether the given payload is {@link MapByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isMapByHookPayload(payload) {
    return payload.method === types_1.Method.Map && payload.type === payloads_1.Payload.Type.Hook;
}
exports.isMapByHookPayload = isMapByHookPayload;
/**
 * Validates whether the given payload is {@link MapByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isMapByPathPayload(payload) {
    return payload.method === types_1.Method.Map && payload.type === payloads_1.Payload.Type.Path;
}
exports.isMapByPathPayload = isMapByPathPayload;
//# sourceMappingURL=Map.js.map
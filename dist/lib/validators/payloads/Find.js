"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFindByValuePayload = exports.isFindByHookPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Validates whether the given payload is {@link FindByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isFindByHookPayload(payload) {
    return payload.method === types_1.Method.Find && payload.type === payloads_1.Payload.Type.Hook;
}
exports.isFindByHookPayload = isFindByHookPayload;
/**
 * Validates whether the given payload is {@link FindByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isFindByValuePayload(payload) {
    return payload.method === types_1.Method.Find && payload.type === payloads_1.Payload.Type.Value;
}
exports.isFindByValuePayload = isFindByValuePayload;
//# sourceMappingURL=Find.js.map
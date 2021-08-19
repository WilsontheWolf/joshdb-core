"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFindByHookPayload = exports.isFindByDataPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Checks whether the given payload is a {@link FindByDataPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
function isFindByDataPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Data && payload.method === types_1.Method.Find;
}
exports.isFindByDataPayload = isFindByDataPayload;
/**
 * Checks whether the given payload is a {@link FindByHookPayload}
 * @since 2.0.0
 * @param payload The payload to check
 * @returns Whether the check is `true` or `false`
 */
function isFindByHookPayload(payload) {
    return payload.type === payloads_1.Payload.Type.Hook && payload.method === types_1.Method.Find;
}
exports.isFindByHookPayload = isFindByHookPayload;
//# sourceMappingURL=Find.js.map
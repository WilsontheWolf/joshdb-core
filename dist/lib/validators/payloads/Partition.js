"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPartitionByValuePayload = exports.isPartitionByHookPayload = void 0;
const payloads_1 = require("../../payloads");
const types_1 = require("../../types");
/**
 * Validates whether the given payload is {@link PartitionByHookPayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isPartitionByHookPayload(payload) {
    return payload.method === types_1.Method.Partition && payload.type === payloads_1.Payload.Type.Hook;
}
exports.isPartitionByHookPayload = isPartitionByHookPayload;
/**
 * Validates whether the given payload is {@link PartitionByValuePayload}
 * @since 2.0.0
 * @param payload The payload to validate.
 * @returns Validation boolean.
 */
function isPartitionByValuePayload(payload) {
    return payload.method === types_1.Method.Partition && payload.type === payloads_1.Payload.Type.Value;
}
exports.isPartitionByValuePayload = isPartitionByValuePayload;
//# sourceMappingURL=Partition.js.map
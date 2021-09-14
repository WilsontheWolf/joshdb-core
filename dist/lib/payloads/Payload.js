"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payload = void 0;
var Payload;
(function (Payload) {
    /**
     * The type enum for {@link Payload}.
     * @see {@link ByHook}
     * @see {@link ByPath}
     * @see {@link ByValue}
     * @since 2.0.0
     */
    let Type;
    (function (Type) {
        /**
         * The hook type.
         * @since 2.0.0
         */
        Type["Hook"] = "HOOK";
        /**
         * The path type.
         * @since 2.0.0
         */
        Type["Path"] = "PATH";
        /**
         * The value type.
         * @since 2.0.0
         */
        Type["Value"] = "VALUE";
    })(Type = Payload.Type || (Payload.Type = {}));
})(Payload = exports.Payload || (exports.Payload = {}));
//# sourceMappingURL=Payload.js.map
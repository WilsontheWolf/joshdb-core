"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoshError = void 0;
/**
 * The base class for errors in {@link Josh}
 * @since 2.0.0
 */
class JoshError extends Error {
    constructor(options) {
        super(options.message);
        this.identifier = options.identifier;
    }
    /**
     * The name of this error.
     */
    get name() {
        return 'JoshError';
    }
}
exports.JoshError = JoshError;
//# sourceMappingURL=JoshError.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoshProviderError = void 0;
const JoshError_1 = require("./JoshError");
/**
 * The base class for {@link JoshProvider}.
 * @since 2.0.0
 */
class JoshProviderError extends JoshError_1.JoshError {
    constructor(options) {
        super(options);
        this.method = options.method;
    }
    /**
     * The name for this error.
     * @since 2.0.0
     */
    get name() {
        return 'JoshProviderError';
    }
}
exports.JoshProviderError = JoshProviderError;
//# sourceMappingURL=JoshProviderError.js.map
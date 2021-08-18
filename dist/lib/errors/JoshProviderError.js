"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoshProviderError = void 0;
const JoshError_1 = require("./JoshError");
class JoshProviderError extends JoshError_1.JoshError {
    constructor(options) {
        super(options);
        this.method = options.method;
    }
    get name() {
        return 'JoshProviderError';
    }
}
exports.JoshProviderError = JoshProviderError;
//# sourceMappingURL=JoshProviderError.js.map
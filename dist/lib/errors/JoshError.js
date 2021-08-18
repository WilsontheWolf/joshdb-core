"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoshError = void 0;
class JoshError extends Error {
    constructor(options) {
        super(options.message);
        this.identifier = options.identifier;
    }
    get name() {
        return 'JoshError';
    }
}
exports.JoshError = JoshError;
//# sourceMappingURL=JoshError.js.map
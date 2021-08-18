"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoshProvider = void 0;
class JoshProvider {
    constructor(options = {}) {
        this.options = options;
    }
    async init(context) {
        const { name, instance } = context;
        this.name = name;
        this.instance = instance;
        return Promise.resolve(context);
    }
}
exports.JoshProvider = JoshProvider;
//# sourceMappingURL=JoshProvider.js.map